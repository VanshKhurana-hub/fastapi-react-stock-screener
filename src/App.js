import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import {
  ThemeProvider,
  CssBaseline,
  Container,
  Box,
  Typography,
} from '@mui/material';

import theme from './theme';
import Navbar from './components/Navbar';
import StockSearch from './components/StockSearch';
import StockChart from './components/StockChart';
import StockTable from './components/StockTable';
import TopMovers from './components/TopMovers';
import StockAdvisor from './components/StockAdvisor';

function App() {
  const [stockData, setStockData] = useState([]);
  const [activeStock, setActiveStock] = useState(null);

  // Helper to fetch any stock and set it as active (used by Movers & Advisor)
  const handleSelectTicker = useCallback(async (symbol) => {
    if (!symbol) return;
    try {
      const res = await axios.get(`http://127.0.0.1:8000/stock/${symbol}`);
      const stock = res.data;
      if (stock && stock.ticker) {
        setActiveStock(stock);
        setStockData((prev) => {
          const filtered = prev.filter((item) => item.ticker !== stock.ticker);
          return [
            {
              id: stock.ticker,
              ticker: stock.ticker,
              currentPrice: stock.current_price,
              marketCap: stock.market_cap,
              changeAmount: stock.change_amount,
              changePercent: stock.change_percent,
              peRatio: stock.pe_ratio,
              dividendYield: stock.dividend_yield,
              history: stock.history,
            },
            ...filtered,
          ];
        });
        window.scrollTo({ top: 120, behavior: 'smooth' });
      }
    } catch (err) {
      console.warn(`Could not load ticker ${symbol}:`, err);
    }
  }, []);

  // Pre-load AAPL on first launch so the dashboard renders live data immediately
  useEffect(() => {
    handleSelectTicker('AAPL');
  }, [handleSelectTicker]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ minHeight: '100vh', bgcolor: '#f8fafc', pb: 6 }}>
        <Navbar />

        <Container maxWidth="lg">
          {/* Search Bar with Popular Ticker Pills */}
          <StockSearch
            setStockData={setStockData}
            setActiveStock={setActiveStock}
            activeStock={activeStock}
          />

          {/* Interactive Chart Component for the Active Stock */}
          {activeStock && <StockChart stock={activeStock} />}

          {/* Watchlist & Multi-Equity Comparison Table */}
          <StockTable
            stockData={stockData}
            setActiveStock={handleSelectTicker}
            activeStock={activeStock}
          />

          {/* Market Movers Deck (Top Gainers & Losers) */}
          <TopMovers onSelectTicker={handleSelectTicker} />

          {/* AI & Fundamental Investment Insights */}
          <StockAdvisor onSelectTicker={handleSelectTicker} />

          {/* Footer */}
          <Box sx={{ textAlign: 'center', pt: 4, pb: 2, borderTop: '1px solid #e2e8f0' }}>
            <Typography variant="caption" color="text.secondary">
              MarketPulse Screener • Financial data powered by Yahoo Finance API • For educational and screening purposes only.
            </Typography>
          </Box>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App;
