import React from 'react';
import {
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
  Box,
} from '@mui/material';
import { formatCurrency, formatPercent, formatMarketCap, formatRatio } from '../utils/formatters';

export default function StockTable({ stockData = [], setActiveStock, activeStock }) {
  if (!stockData || stockData.length === 0) {
    return (
      <Paper sx={{ p: 4, mb: 4, textAlign: 'center', borderRadius: 3, bgcolor: '#ffffff' }}>
        <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 600 }}>
          📋 Your Watchlist is Empty
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Search for a stock ticker above (like <strong>AAPL</strong> or <strong>NVDA</strong>) to track and compare fundamentals here.
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper sx={{ mb: 4, borderRadius: 3, overflow: 'hidden' }}>
      <Box sx={{ p: 2.5, pb: 1.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 700, color: '#0f172a' }}>
            📊 Watchlist & Comparison
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Tracking {stockData.length} active {stockData.length === 1 ? 'equity' : 'equities'}
          </Typography>
        </Box>
      </Box>

      <TableContainer>
        <Table sx={{ minWidth: 650 }}>
          <TableHead sx={{ bgcolor: '#f8fafc' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 700, color: '#475569' }}>Ticker</TableCell>
              <TableCell align="right" sx={{ fontWeight: 700, color: '#475569' }}>Current Price</TableCell>
              <TableCell align="right" sx={{ fontWeight: 700, color: '#475569' }}>24h Change</TableCell>
              <TableCell align="right" sx={{ fontWeight: 700, color: '#475569' }}>Market Cap</TableCell>
              <TableCell align="right" sx={{ fontWeight: 700, color: '#475569' }}>P/E Ratio</TableCell>
              <TableCell align="center" sx={{ fontWeight: 700, color: '#475569' }}>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {stockData.map((row) => {
              const isGainer = (row.changePercent || 0) >= 0;
              const isSelected = activeStock?.ticker === row.ticker;

              return (
                <TableRow
                  key={row.ticker}
                  hover
                  sx={{
                    bgcolor: isSelected ? 'rgba(37, 99, 235, 0.04)' : 'inherit',
                    cursor: 'pointer',
                  }}
                  onClick={() => setActiveStock && setActiveStock(row)}
                >
                  <TableCell component="th" scope="row">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography sx={{ fontWeight: 800, color: '#0f172a' }}>
                        {row.ticker}
                      </Typography>
                      {isSelected && (
                        <Chip label="Viewing" size="small" color="primary" sx={{ height: 20, fontSize: '0.65rem' }} />
                      )}
                    </Box>
                  </TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700 }}>
                    {formatCurrency(row.currentPrice)}
                  </TableCell>
                  <TableCell align="right">
                    <Chip
                      label={formatPercent(row.changePercent)}
                      size="small"
                      sx={{
                        bgcolor: isGainer ? '#ecfdf5' : '#fef2f2',
                        color: isGainer ? '#059669' : '#dc2626',
                        fontWeight: 700,
                        border: `1px solid ${isGainer ? '#a7f3d0' : '#fecaca'}`,
                      }}
                    />
                  </TableCell>
                  <TableCell align="right" sx={{ color: '#475569', fontWeight: 600 }}>
                    {formatMarketCap(row.marketCap)}
                  </TableCell>
                  <TableCell align="right" sx={{ color: '#475569', fontWeight: 600 }}>
                    {formatRatio(row.peRatio)}
                  </TableCell>
                  <TableCell align="center">
                    <Button
                      size="small"
                      variant={isSelected ? 'contained' : 'outlined'}
                      color="primary"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (setActiveStock) setActiveStock(row);
                      }}
                      sx={{ py: 0.3, px: 1.5, fontSize: '0.75rem' }}
                    >
                      {isSelected ? 'Active' : 'View Chart'}
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}
