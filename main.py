from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import yfinance as yf
import pandas as pd
import requests
import os

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change this in production to only allow your frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ Fetch stock data for StockSearch / StockTable
@app.get("/stock/{ticker}")
def get_stock_data(ticker: str):
    try:
        stock = yf.Ticker(ticker)
        info = stock.info
        if not info:
            return {"error": "No data found"}
        return {
            "ticker": ticker,
            "current_price": info.get("currentPrice"),
            "market_cap": info.get("marketCap"),
            "pe_ratio": info.get("trailingPE"),
            "dividend_yield": info.get("dividendYield"),
            "previous_close": info.get("previousClose")
        }
    except Exception as e:
        return {"error": str(e)}

# ✅ Top movers data
@app.get("/top-movers")
def get_top_movers():
    tickers = ["AAPL", "MSFT", "GOOGL", "AMZN", "TSLA", "META", "NVDA"]
    movers = []
    for t in tickers:
        stock = yf.Ticker(t)
        hist = stock.history(period="2d")
        if len(hist) >= 2:
            prev_close = hist["Close"].iloc[-2]
            latest_close = hist["Close"].iloc[-1]
            change_percent = ((latest_close - prev_close) / prev_close) * 100
            movers.append({
                "ticker": t,
                "price": round(latest_close, 2),
                "change_percent": round(change_percent, 2)
            })
    df = pd.DataFrame(movers).sort_values(by="change_percent", ascending=False)
    return df.to_dict(orient="records")


@app.get("/stock-advice")
def get_stock_advice():
    try:
        tickers = ["AAPL", "MSFT", "GOOGL", "AMZN", "TSLA"]
        stock_data = {}
        for t in tickers:
            stock = yf.Ticker(t)
            info = stock.info
            stock_data[t] = {
                "current_price": info.get("currentPrice"),
                "market_cap": info.get("marketCap"),
                "pe_ratio": info.get("trailingPE")
            }

        prompt = f""" "Recommend 5 top technology stocks expected to grow in the next 3 months. Give reasons briefly."

        """

        api_key = os.getenv("PERPLEXITY_API_KEY")
        if not api_key:
            return {"error": "PERPLEXITY_API_KEY environment variable not set."}

        print(f"DEBUG: Using Perplexity API key? {'Yes' if api_key else 'No'}")

        res = requests.post(
            "https://api.perplexity.ai/chat/completions",
            headers={
                "Authorization": f"Bearer {"api_key"}",
                "Content-Type": "application/json"
            },
            json={
                "model": "sonar-pro",
                "messages": [{"role": "user", "content": prompt}]
            }
        )

        data = res.json()
        print("DEBUG: Perplexity API response", data)

        if res.status_code != 200:
            return {"error": "Failed to get AI response", "details": data}

        choices = data.get("choices", [])
        if choices and "message" in choices:
                reply = choices["message"].get("content", "")  # Use  to get first item in the list
        else:
                reply = ""


        return {"recommendation": reply or "No recommendation returned by AI."}

    except Exception as e:
        return {"error": str(e)}

