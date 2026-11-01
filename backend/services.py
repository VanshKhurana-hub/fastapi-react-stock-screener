import time
import logging
from typing import Optional, List, Dict, Any
import requests
import pandas as pd
import numpy as np
import yfinance as yf

# Configure simple logging
logger = logging.getLogger("stock_screener")
logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")

# Simple in-memory cache to prevent hitting Yahoo Finance rate limits
# Structure: { key: { "data": ..., "expires_at": timestamp } }
CACHE: Dict[str, Dict[str, Any]] = {}
QUOTE_CACHE_TTL = 300   # 5 minutes
MOVERS_CACHE_TTL = 300  # 5 minutes


def clean_number(value: Any, default: Optional[float] = 0.0) -> Optional[float]:
    """
    Safely converts inputs to clean rounded floats, gracefully handling
    None, NaNs, infinities, and string errors.
    """
    if value is None or pd.isna(value):
        return default
    try:
        f_val = float(value)
        if np.isnan(f_val) or np.isinf(f_val):
            return default
        return round(f_val, 2)
    except (ValueError, TypeError):
        return default


def get_stock_data_safe(ticker: str) -> Optional[Dict[str, Any]]:
    """
    Fetches stock data from yfinance safely with in-memory caching
    and clean numeric handling.
    """
    clean_ticker = ticker.strip().upper()
    current_time = time.time()

    # 1. Return cached copy if still fresh
    cache_key = f"quote_{clean_ticker}"
    if cache_key in CACHE and CACHE[cache_key]["expires_at"] > current_time:
        logger.info(f"Serving {clean_ticker} from cache.")
        return CACHE[cache_key]["data"]

    # 2. Fetch from yfinance
    try:
        logger.info(f"Fetching fresh data for {clean_ticker} from Yahoo Finance.")
        stock = yf.Ticker(clean_ticker)
        
        # History check (last 1 month for trend charting)
        hist = stock.history(period="1mo", auto_adjust=True)
        info = stock.info or {}

        latest_price = None
        prev_close = None
        chart_points = []

        if not hist.empty and len(hist) >= 2:
            hist = hist.ffill().bfill()
            latest_price = clean_number(hist["Close"].iloc[-1])
            prev_close = clean_number(hist["Close"].iloc[-2])

            for idx, row in hist.iterrows():
                try:
                    date_label = idx.strftime("%b %d") if hasattr(idx, "strftime") else str(idx)[:10]
                except Exception:
                    date_label = str(idx)[:10]
                chart_points.append({
                    "date": date_label,
                    "price": clean_number(row["Close"])
                })
        elif info:
            # Fallback to info dictionary if history is sparse
            latest_price = clean_number(info.get("currentPrice") or info.get("regularMarketPrice"))
            prev_close = clean_number(info.get("previousClose") or info.get("regularMarketPreviousClose"))

        # If we couldn't resolve valid prices, ticker is likely invalid
        if latest_price is None or prev_close is None or prev_close <= 0:
            logger.warning(f"No valid price history found for ticker '{clean_ticker}'.")
            return None

        change_amount = round(latest_price - prev_close, 2)
        change_percent = round((change_amount / prev_close) * 100, 2)

        dividend_yield = info.get("dividendYield")
        if dividend_yield is not None:
            dividend_yield = round(clean_number(dividend_yield) * 100, 2)

        result = {
            "ticker": clean_ticker,
            "current_price": latest_price,
            "previous_close": prev_close,
            "change_amount": change_amount,
            "change_percent": change_percent,
            "market_cap": info.get("marketCap"),
            "pe_ratio": clean_number(info.get("trailingPE"), default=None),
            "dividend_yield": dividend_yield,
            "history": chart_points,
        }

        # 3. Store in cache
        CACHE[cache_key] = {
            "data": result,
            "expires_at": current_time + QUOTE_CACHE_TTL
        }
        return result

    except Exception as e:
        logger.error(f"Error fetching data for {clean_ticker}: {e}")
        return None


def get_top_movers_safe(tickers: Optional[List[str]] = None) -> List[Dict[str, Any]]:
    """
    Retrieves top mover stocks, computing percentage changes safely.
    Cached for 5 minutes to avoid rapid-fire requests.
    """
    if tickers is None:
        tickers = ["AAPL", "MSFT", "GOOGL", "AMZN", "TSLA", "META", "NVDA"]

    current_time = time.time()
    cache_key = "market_top_movers"

    if cache_key in CACHE and CACHE[cache_key]["expires_at"] > current_time:
        logger.info("Serving top movers from cache.")
        return CACHE[cache_key]["data"]

    logger.info("Calculating top movers from Yahoo Finance...")
    movers = []
    for t in tickers:
        data = get_stock_data_safe(t)
        if data:
            movers.append({
                "ticker": data["ticker"],
                "price": data["current_price"],
                "change_percent": data["change_percent"],
                "is_gainer": data["change_percent"] >= 0
            })

    # Sort descending by change_percent (gainers first)
    movers.sort(key=lambda x: x["change_percent"], reverse=True)

    # Cache the sorted list
    CACHE[cache_key] = {
        "data": movers,
        "expires_at": current_time + MOVERS_CACHE_TTL
    }
    return movers


def get_stock_advice_safe(api_key: Optional[str] = None) -> Dict[str, Any]:
    """
    Generates stock recommendations. Uses Perplexity AI if an API key is provided,
    or returns high-quality curated analysis as a fallback.
    """
    default_items = [
        {"ticker": "Apple (AAPL)", "reason": "Strong cash flow, robust ecosystem, and high services revenue."},
        {"ticker": "Microsoft (MSFT)", "reason": "Cloud growth with Azure and broad enterprise AI integration."},
        {"ticker": "Nvidia (NVDA)", "reason": "Sustained data center computing demand and AI hardware dominance."},
        {"ticker": "Alphabet (GOOGL)", "reason": "Solid digital ad margins and long-term investments in Gemini AI."},
        {"ticker": "Amazon (AMZN)", "reason": "AWS cloud margins expanding and e-commerce efficiency gains."}
    ]

    if not api_key:
        return {
            "recommendation": "Curated technology stock recommendations based on recent financial fundamentals:",
            "items": default_items
        }

    try:
        prompt = "Recommend 5 top technology stocks expected to grow in the next 3 months. Give concise reasons."
        response = requests.post(
            "https://api.perplexity.ai/chat/completions",
            headers={
                "Authorization": f"Bearer {api_key}",
                "Content-Type": "application/json"
            },
            json={
                "model": "sonar-pro",
                "messages": [{"role": "user", "content": prompt}]
            },
            timeout=10
        )
        if response.status_code == 200:
            data = response.json()
            choices = data.get("choices", [])
            if choices and len(choices) > 0:
                reply = choices[0].get("message", {}).get("content", "")
                return {"recommendation": reply, "items": default_items}

        logger.warning(f"Perplexity API returned status {response.status_code}. Using fallback advice.")
    except Exception as e:
        logger.warning(f"Could not connect to Perplexity AI: {e}. Using fallback advice.")

    return {
        "recommendation": "Curated technology stock recommendations based on recent financial fundamentals:",
        "items": default_items
    }

