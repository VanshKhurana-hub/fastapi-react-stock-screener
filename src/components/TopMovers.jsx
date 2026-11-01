import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Typography,
  Grid,
  Paper,
  Box,
  Chip,
  CircularProgress,
  Button,
} from '@mui/material';
import { formatCurrency, formatPercent } from '../utils/formatters';

export default function TopMovers({ onSelectTicker }) {
  const [gainers, setGainers] = useState([]);
  const [losers, setLosers] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchMovers = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://127.0.0.1:8000/top-movers');
      const allMovers = res.data || [];
      setGainers(allMovers.filter((stock) => stock.change_percent >= 0));
      setLosers(allMovers.filter((stock) => stock.change_percent < 0));
    } catch (err) {
      console.error('Failed to load top movers:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovers();
  }, []);

  const renderStockCard = (stock, isGainer) => (
    <Paper
      key={stock.ticker}
      onClick={() => onSelectTicker && onSelectTicker(stock.ticker)}
      sx={{
        p: 2,
        mb: 2,
        borderRadius: 2.5,
        borderLeft: `5px solid ${isGainer ? '#10b981' : '#ef4444'}`,
        cursor: onSelectTicker ? 'pointer' : 'default',
        transition: 'all 0.2s ease',
        '&:hover': {
          transform: onSelectTicker ? 'translateY(-2px)' : 'none',
          boxShadow: '0 6px 12px -2px rgb(0 0 0 / 0.1)',
        },
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#0f172a' }}>
            {stock.ticker}
          </Typography>
          <Typography variant="body2" sx={{ fontWeight: 600, color: '#475569' }}>
            {formatCurrency(stock.price)}
          </Typography>
        </Box>
        <Chip
          label={formatPercent(stock.change_percent)}
          size="small"
          sx={{
            bgcolor: isGainer ? '#ecfdf5' : '#fef2f2',
            color: isGainer ? '#059669' : '#dc2626',
            fontWeight: 800,
            border: `1px solid ${isGainer ? '#a7f3d0' : '#fecaca'}`,
          }}
        />
      </Box>
    </Paper>
  );

  return (
    <Box sx={{ mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 700, color: '#0f172a' }}>
            ⚡ Market Movers
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Today's highest velocity market leaders and laggards
          </Typography>
        </Box>
        <Button
          size="small"
          variant="outlined"
          onClick={fetchMovers}
          disabled={loading}
          sx={{ fontSize: '0.75rem', px: 2 }}
        >
          {loading ? <CircularProgress size={16} /> : '🔄 Refresh'}
        </Button>
      </Box>

      {loading && gainers.length === 0 ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress size={32} />
        </Box>
      ) : (
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#059669' }}>
                🚀 Top Gainers
              </Typography>
              <Chip label={gainers.length} size="small" sx={{ height: 20, fontSize: '0.7rem' }} />
            </Box>
            {gainers.length > 0 ? (
              gainers.map((stock) => renderStockCard(stock, true))
            ) : (
              <Typography variant="body2" color="text.secondary">No gainers recorded today.</Typography>
            )}
          </Grid>

          <Grid item xs={12} sm={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#dc2626' }}>
                🔻 Top Losers
              </Typography>
              <Chip label={losers.length} size="small" sx={{ height: 20, fontSize: '0.7rem' }} />
            </Box>
            {losers.length > 0 ? (
              losers.map((stock) => renderStockCard(stock, false))
            ) : (
              <Typography variant="body2" color="text.secondary">No losers recorded today.</Typography>
            )}
          </Grid>
        </Grid>
      )}
    </Box>
  );
}
