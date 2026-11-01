# 📊 MarketPulse - Full-Stack Stock Screener & Dashboard

A modern, full-stack financial market dashboard built with **FastAPI**, **React**, **Chart.js**, and **Material UI (MUI)**. It provides real-time equities tracking, 30-day interactive trend charting, market velocity movers, and AI-driven quantitative stock insights with built-in caching and API protection.

---

## 🌟 Key Features

* **Interactive Trend Charts**: Smooth 30-day historical price visualization powered by `Chart.js` with responsive gradient fills.
* **Real-time Fundamentals**: Key metrics including Market Cap, P/E Ratio, Dividend Yield, and 24-hour price change.
* **Watchlist Comparison Table**: Track and compare multiple equities simultaneously with active selection.
* **Market Movers Deck**: Live calculation of top market gainers and losers.
* **AI & Quantitative Insights**: Fundamental investment thesis suggestions with optional Perplexity AI integration.
* **Zero-Cost Caching Layer**: In-memory caching with 5-minute TTL to prevent hitting Yahoo Finance rate limits and drastically improve response times.
* **API Security & Abuse Protection**: Strict CORS origin restriction and IP-based rate limiting via `slowapi`.

---

## 🛠️ Tech Stack

### Backend
* **FastAPI** - High-performance Python web framework
* **yfinance** - Real-time equity data integration
* **Pandas & NumPy** - Data sanitization, NaN/None handling, and statistical processing
* **slowapi** - Client IP rate-limiting
* **Pydantic v2** - Strict request and response schemas

### Frontend
* **React 19** - Component-based user interface
* **Material UI (MUI v7)** - Modern financial dashboard design system
* **Chart.js & react-chartjs-2** - Canvas-based financial time-series charting
* **Axios** - HTTP client for API communication

---

## 📁 Project Architecture

```text
fastapi-react-stock-screener/
├── .github/
│   └── workflows/
│       └── ci.yml               # Automated CI for Python syntax & React build
├── backend/
│   ├── main.py                  # FastAPI app factory, CORS & Rate Limiter
│   ├── services.py              # yfinance fetching, 5-min caching & math sanitization
│   ├── schemas.py               # Pydantic models for stock & market data
│   ├── .env                     # Local environment settings (git-ignored)
│   ├── .env.example             # Template for environment settings
│   └── requirements.txt         # Pinned backend dependencies
├── src/
│   ├── components/
│   │   ├── Navbar.jsx           # Top branding bar with live market indicator
│   │   ├── StockSearch.js       # Search bar with popular ticker quick-chips
│   │   ├── StockChart.jsx       # Interactive 30-day Chart.js line chart
│   │   ├── StockTable.js        # Multi-stock watchlist and comparison table
│   │   ├── TopMovers.jsx        # Gainers & losers cards with 1-click chart select
│   │   └── StockAdvisor.js      # Fundamental and AI equity insights
│   ├── utils/
│   │   └── formatters.js        # Currency ($), percentage (%), and market cap formatters
│   ├── theme.js                 # Custom financial dashboard MUI theme
│   ├── App.js                   # Main application view & state manager
│   └── index.js
├── main.py                      # Root proxy to backend/main.py
├── package.json
└── README.md
```

---

## 🚀 Getting Started

### 1. Prerequisites
* **Python 3.10+**
* **Node.js 18+ and npm**

---

### 2. Backend Setup

1. **Install Python dependencies**:
   ```bash
   pip install -r backend/requirements.txt
   ```

2. **Configure environment variables (optional)**:
   A `backend/.env` file is included by default:
   ```env
   FRONTEND_URL=http://localhost:3000,http://127.0.0.1:3000
   RATE_LIMIT_STOCK=20/minute
   RATE_LIMIT_MOVERS=10/minute
   PERPLEXITY_API_KEY=
   ```

3. **Start the FastAPI backend server**:
   ```bash
   uvicorn main:app --reload
   ```
   * **API Base URL**: `http://127.0.0.1:8000`
   * **Swagger Interactive Docs**: `http://127.0.0.1:8000/docs`

---

### 3. Frontend Setup

1. **Install Node dependencies** (if not already installed):
   ```bash
   npm install
   ```

2. **Start the React development server**:
   ```bash
   npm start
   ```
   * The app will automatically open at **`http://localhost:3000`**.

---

## 📡 API Endpoints

| Method | Endpoint | Description | Rate Limit |
|---|---|---|---|
| `GET` | `/` | API status and health check | None |
| `GET` | `/stock/{ticker}` | Returns real-time fundamentals and 30-day price history | 20 / minute |
| `GET` | `/top-movers` | Returns top gainers and losers across mega-cap equities | 10 / minute |
| `GET` | `/stock-advice` | Returns AI or quantitative investment insights | 5 / minute |
