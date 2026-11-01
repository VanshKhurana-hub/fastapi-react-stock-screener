import React, { useState } from 'react';
import axios from 'axios';
import {
  Box,
  TextField,
  Button,
  Typography,
  Chip,
  Alert,
  CircularProgress,
  Paper,
} from '@mui/material';

const POPULAR_TICKERS = ['AAPL', 'NVDA', 'MSFT', 'TSLA', 'AMZN', 'GOOGL', 'META'];

export default function StockSearch({ setStockData, setActiveStock, activeStock }) {
  const [ticker, setTicker] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchStock = async (symbolToSearch) => {
    const sym = (symbolToSearch || ticker).trim().toUpperCase();
    if (!sym) return;

    setLoading(true);
    setError('');

    try {
      const response = await axios.get(`http://127.0.0.1:8000/stock/${sym}`);
      const stock = response.data;

      // Update active stock for the interactive chart
      if (setActiveStock) {
        setActiveStock(stock);
      }

      // Add to watchlist (avoiding duplicates)
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

      setTicker('');
    } catch (err) {
      const msg =
        err.response?.data?.detail ||
        err.response?.data?.message ||
        'Could not fetch stock data. Please check the ticker symbol.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      fetchStock();
    }
  };

  return (
    <Paper sx={{ p: 3, mb: 3, borderRadius: 3 }}>
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, color: '#0f172a' }}>
        🔍 Analyze Any Equity
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Search any ticker to view real-time fundamentals, price changes, and historical charts.
      </Typography>

      <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center', mb: 2, flexWrap: 'wrap' }}>
        <TextField
          size="small"
          placeholder="Enter ticker (e.g., AAPL, NVDA, TSLA)..."
          variant="outlined"
          value={ticker}
          onChange={(e) => {
            setTicker(e.target.value.toUpperCase());
            if (error) setError('');
          }}
          onKeyDown={handleKeyDown}
          disabled={loading}
          sx={{ flexGrow: 1, minWidth: 220 }}
        />
        <Button
          variant="contained"
          onClick={() => fetchStock()}
          disabled={loading || !ticker.trim()}
          sx={{
            bgcolor: '#0f172a',
            color: '#fff',
            px: 3,
            py: 1,
            '&:hover': { bgcolor: '#1e293b' },
          }}
        >
          {loading ? <CircularProgress size={22} color="inherit" /> : 'Search'}
        </Button>
      </Box>

      {/* Quick Select Tickers */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
          Popular:
        </Typography>
        {POPULAR_TICKERS.map((sym) => (
          <Chip
            key={sym}
            label={sym}
            size="small"
            clickable
            onClick={() => fetchStock(sym)}
            variant={activeStock?.ticker === sym ? 'filled' : 'outlined'}
            color={activeStock?.ticker === sym ? 'primary' : 'default'}
            sx={{
              fontWeight: 600,
              fontSize: '0.75rem',
              cursor: 'pointer',
              '&:hover': { bgcolor: '#f1f5f9' },
            }}
          />
        ))}
      </Box>

      {error && (
        <Alert severity="error" sx={{ mt: 2, borderRadius: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}
    </Paper>
  );
}
