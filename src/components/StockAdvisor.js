import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Chip,
  Button,
  CircularProgress,
} from '@mui/material';

const DEFAULT_RECOMMENDATIONS = [
  {
    ticker: 'AAPL',
    name: 'Apple Inc.',
    reason: 'Strong free cash flow, robust product ecosystem, and expanding services revenue margins.',
    tag: 'Ecosystem & Cash Flow',
  },
  {
    ticker: 'MSFT',
    name: 'Microsoft Corp.',
    reason: 'Cloud leadership with Azure growth and deep enterprise generative AI integrations.',
    tag: 'Enterprise Cloud & AI',
  },
  {
    ticker: 'NVDA',
    name: 'Nvidia Corp.',
    reason: 'Global standard for AI data center compute acceleration with expanding supply capability.',
    tag: 'Semiconductor Leader',
  },
  {
    ticker: 'GOOGL',
    name: 'Alphabet Inc.',
    reason: 'Search margin resilience combined with rapid enterprise Gemini model deployment.',
    tag: 'Search & Multimodal AI',
  },
  {
    ticker: 'AMZN',
    name: 'Amazon.com Inc.',
    reason: 'AWS operating margins accelerating alongside AI infrastructure and fulfillment efficiency.',
    tag: 'Cloud & Retail Scale',
  },
];

export default function StockAdvisor({ onSelectTicker }) {
  const [recommendations, setRecommendations] = useState(DEFAULT_RECOMMENDATIONS);
  const [loading, setLoading] = useState(false);
  const [aiNote, setAiNote] = useState('');

  const fetchAdvice = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://127.0.0.1:8000/stock-advice');
      if (res.data) {
        if (res.data.items && res.data.items.length > 0) {
          const parsed = res.data.items.map((item) => {
            const rawTicker = item.ticker.match(/\(([A-Z]+)\)/)?.[1] || item.ticker.split(' ')[0];
            return {
              ticker: rawTicker,
              name: item.ticker,
              reason: item.reason,
              tag: 'Fundamental Growth',
            };
          });
          setRecommendations(parsed);
        }
        if (res.data.recommendation) {
          setAiNote(res.data.recommendation);
        }
      }
    } catch (err) {
      console.warn('Could not fetch remote advice, showing curated fundamentals:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdvice();
  }, []);

  return (
    <Box sx={{ mb: 6 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 700, color: '#0f172a' }}>
            💡 Quantitative & AI Stock Insights
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Algorithmic equity suggestions based on financial metrics, cash flow, and market catalysts
          </Typography>
        </Box>
        <Button
          size="small"
          variant="outlined"
          onClick={fetchAdvice}
          disabled={loading}
          sx={{ fontSize: '0.75rem', px: 2 }}
        >
          {loading ? <CircularProgress size={16} /> : '⚡ Refresh Analysis'}
        </Button>
      </Box>

      {aiNote && (
        <Paper sx={{ p: 2, mb: 2.5, bgcolor: '#f8fafc', borderLeft: '4px solid #2563eb' }}>
          <Typography variant="body2" sx={{ fontStyle: 'italic', color: '#334155' }}>
            "{aiNote}"
          </Typography>
        </Paper>
      )}

      <Grid container spacing={2}>
        {recommendations.map((item) => (
          <Grid item xs={12} sm={6} md={4} key={item.ticker}>
            <Paper
              sx={{
                p: 2.5,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                borderRadius: 2.5,
                transition: 'all 0.2s ease',
                cursor: onSelectTicker ? 'pointer' : 'default',
                '&:hover': {
                  transform: onSelectTicker ? 'translateY(-2px)' : 'none',
                  boxShadow: '0 6px 16px -2px rgb(0 0 0 / 0.08)',
                },
              }}
              onClick={() => onSelectTicker && onSelectTicker(item.ticker)}
            >
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#0f172a' }}>
                    {item.name || item.ticker}
                  </Typography>
                  <Chip
                    label={item.tag}
                    size="small"
                    sx={{
                      fontSize: '0.65rem',
                      fontWeight: 700,
                      bgcolor: '#eff6ff',
                      color: '#2563eb',
                      border: '1px solid #bfdbfe',
                    }}
                  />
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1, lineHeight: 1.5 }}>
                  {item.reason}
                </Typography>
              </Box>

              {onSelectTicker && (
                <Button
                  size="small"
                  variant="text"
                  color="primary"
                  sx={{ mt: 2, alignSelf: 'flex-start', p: 0, minWidth: 'auto', fontSize: '0.75rem', fontWeight: 700 }}
                >
                  Analyze Chart →
                </Button>
              )}
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
