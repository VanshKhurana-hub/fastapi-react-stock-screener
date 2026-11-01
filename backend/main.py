import os
import logging
from typing import List
from dotenv import load_dotenv
from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware

# Set up logging
logger = logging.getLogger("stock_screener")
logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")

# Load environment variables from .env
load_dotenv()

# Read settings with safe local fallbacks
FRONTEND_URLS_RAW = os.getenv("FRONTEND_URL", "http://localhost:3000,http://127.0.0.1:3000")
ALLOWED_ORIGINS = [url.strip() for url in FRONTEND_URLS_RAW.split(",") if url.strip()]
RATE_LIMIT_STOCK = os.getenv("RATE_LIMIT_STOCK", "20/minute")
RATE_LIMIT_MOVERS = os.getenv("RATE_LIMIT_MOVERS", "10/minute")
PERPLEXITY_API_KEY = os.getenv("PERPLEXITY_API_KEY", "")

# Create FastAPI app
app = FastAPI(
    title="Stock Screener API",
    description="Clean, reliable, and rate-limited financial market API.",
    version="1.0.0"
)

# Set up Rate Limiting with graceful fallback if slowapi isn't installed yet
try:
    from slowapi import Limiter, _rate_limit_exceeded_handler
    from slowapi.util import get_remote_address
    from slowapi.errors import RateLimitExceeded

    limiter = Limiter(key_func=get_remote_address)
    app.state.limiter = limiter
    app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)
    logger.info("Rate limiting enabled via slowapi.")
except ImportError:
    logger.warning("slowapi is not installed. Run 'pip install slowapi' to activate rate limiting.")
    # Safe no-op limiter fallback so decorators don't cause errors
    class DummyLimiter:
        def limit(self, limit_value: str):
            def decorator(func):
                return func
            return decorator
    limiter = DummyLimiter()

# Configure Strict CORS (only allows trusted frontend origins)
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "OPTIONS"],
    allow_headers=["*"],
)

# Import schemas and services
from schemas import StockResponse, TopMoverItem, StockAdviceResponse
from services import get_stock_data_safe, get_top_movers_safe, get_stock_advice_safe


@app.get("/")
def root():
    return {
        "status": "online",
        "message": "Stock Screener API is running smoothly.",
        "endpoints": ["/stock/{ticker}", "/top-movers", "/stock-advice"]
    }


@app.get("/stock/{ticker}", response_model=StockResponse)
@limiter.limit(RATE_LIMIT_STOCK)
def get_stock(request: Request, ticker: str):
    """
    Look up real-time stock fundamentals and price changes.
    Cached for 5 minutes.
    """
    clean_ticker = ticker.strip().upper()
    if not clean_ticker or len(clean_ticker) > 10:
        raise HTTPException(status_code=400, detail="Invalid ticker symbol format.")

    data = get_stock_data_safe(clean_ticker)
    if not data:
        raise HTTPException(
            status_code=404,
            detail=f"Stock ticker '{clean_ticker}' was not found or has no available trading data."
        )
    return data


@app.get("/top-movers", response_model=List[TopMoverItem])
@limiter.limit(RATE_LIMIT_MOVERS)
def get_top_movers(request: Request):
    """
    Get the top gainers and losers across mega-cap equities.
    Cached for 5 minutes.
    """
    return get_top_movers_safe()


@app.get("/stock-advice", response_model=StockAdviceResponse)
@limiter.limit("5/minute")
def get_stock_advice(request: Request):
    """
    Get curated or AI-driven stock recommendations.
    """
    return get_stock_advice_safe(api_key=PERPLEXITY_API_KEY)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
