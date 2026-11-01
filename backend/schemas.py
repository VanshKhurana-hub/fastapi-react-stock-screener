from typing import Optional, List
from pydantic import BaseModel, Field

class ChartPoint(BaseModel):
    date: str
    price: float

class StockResponse(BaseModel):
    ticker: str = Field(..., description="Stock ticker symbol (e.g., AAPL)")
    current_price: float = Field(..., description="Latest closing or market price")
    previous_close: float = Field(..., description="Previous session closing price")
    change_amount: float = Field(..., description="Dollar change from previous close")
    change_percent: float = Field(..., description="Percentage change from previous close")
    market_cap: Optional[int] = Field(None, description="Company market capitalization")
    pe_ratio: Optional[float] = Field(None, description="Price to Earnings ratio")
    dividend_yield: Optional[float] = Field(None, description="Dividend yield percentage")
    history: Optional[List[ChartPoint]] = Field(default=[], description="Recent historical close prices for charting")

class TopMoverItem(BaseModel):
    ticker: str
    price: float
    change_percent: float
    is_gainer: bool

class StockAdviceItem(BaseModel):
    ticker: str
    reason: str

class StockAdviceResponse(BaseModel):
    recommendation: Optional[str] = None
    items: Optional[List[StockAdviceItem]] = None

