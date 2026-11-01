import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { Box, Paper, Typography, Grid, Chip } from '@mui/material';
import { formatCurrency, formatPercent, formatMarketCap, formatRatio } from '../utils/formatters';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function StockChart({ stock }) {
  if (!stock) return null;

  const isGainer = stock.change_percent >= 0;
  const strokeColor = isGainer ? '#10b981' : '#ef4444';
  const fillColor = isGainer ? 'rgba(16, 185, 129, 0.12)' : 'rgba(239, 68, 68, 0.12)';

  const history = stock.history && stock.history.length > 0 ? stock.history : [];
  const labels = history.map((p) => p.date);
  const dataPoints = history.map((p) => p.price);

  const chartData = {
    labels: labels.length > 0 ? labels : ['Previous', 'Current'],
    datasets: [
      {
        label: `${stock.ticker} Price`,
        data: dataPoints.length > 0 ? dataPoints : [stock.previous_close, stock.current_price],
        borderColor: strokeColor,
        backgroundColor: fillColor,
        fill: true,
        tension: 0.25,
        borderWidth: 2.5,
        pointRadius: history.length > 15 ? 2 : 4,
        pointHoverRadius: 6,
        pointBackgroundColor: strokeColor,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#0f172a',
        titleFont: { size: 12, weight: 'bold' },
        bodyFont: { size: 13 },
        padding: 10,
        cornerRadius: 8,
        displayColors: false,
        callbacks: {
          label: (context) => ` Price: ${formatCurrency(context.parsed.y)}`,
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { maxTicksLimit: 8, font: { size: 11 }, color: '#64748b' },
      },
      y: {
        grid: { color: '#f1f5f9' },
        ticks: {
          font: { size: 11 },
          color: '#64748b',
          callback: (value) => `$${value}`,
        },
      },
    },
  };

  return (
    <Paper sx={{ p: 3, mb: 4, borderRadius: 3 }}>
      {/* Header Info */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2, flexWrap: 'wrap', gap: 1 }}>
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Typography variant="h5" component="span" sx={{ fontWeight: 800 }}>
              {stock.ticker}
            </Typography>
            <Chip
              label={formatPercent(stock.change_percent)}
              size="small"
              sx={{
                bgcolor: isGainer ? '#ecfdf5' : '#fef2f2',
                color: isGainer ? '#059669' : '#dc2626',
                fontWeight: 700,
                border: `1px solid ${isGainer ? '#a7f3d0' : '#fecaca'}`,
              }}
            />
          </Box>
          <Typography variant="h4" sx={{ fontWeight: 800, mt: 0.5, color: '#0f172a' }}>
            {formatCurrency(stock.current_price)}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {isGainer ? '+' : ''}{formatCurrency(stock.change_amount)} Today
          </Typography>
        </Box>

        {/* Fundamental Metrics */}
        <Grid container spacing={2} sx={{ maxWidth: { xs: '100%', md: 450 } }}>
          <Grid item xs={6} sm={3}>
            <Typography variant="caption" color="text.secondary" display="block">Market Cap</Typography>
            <Typography variant="body2" sx={{ fontWeight: 700 }}>{formatMarketCap(stock.market_cap)}</Typography>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Typography variant="caption" color="text.secondary" display="block">P/E Ratio</Typography>
            <Typography variant="body2" sx={{ fontWeight: 700 }}>{formatRatio(stock.pe_ratio)}</Typography>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Typography variant="caption" color="text.secondary" display="block">Prev Close</Typography>
            <Typography variant="body2" sx={{ fontWeight: 700 }}>{formatCurrency(stock.previous_close)}</Typography>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Typography variant="caption" color="text.secondary" display="block">Div Yield</Typography>
            <Typography variant="body2" sx={{ fontWeight: 700 }}>
              {stock.dividend_yield ? `${stock.dividend_yield}%` : 'N/A'}
            </Typography>
          </Grid>
        </Grid>
      </Box>

      {/* Chart Canvas */}
      <Box sx={{ height: 280, width: '100%', mt: 2 }}>
        <Line data={chartData} options={options} />
      </Box>
    </Paper>
  );
}

