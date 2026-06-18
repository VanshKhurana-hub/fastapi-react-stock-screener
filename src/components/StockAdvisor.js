import React, { useState } from "react";
import { Box, Paper, Typography, List, ListItem, ListItemText } from '@mui/material';

const StockAdvisor = () => {
  const [recommendation] = useState([
    {
      ticker: 'Apple (AAPL)',
      reason: 'Strong cash flow, robust product ecosystem, and solid earnings growth.',
    },
    {
      ticker: 'Microsoft (MSFT)',
      reason: 'Leader in cloud computing with Azure growth and enterprise software demand.',
    },
    {
      ticker: 'Nvidia (NVDA)',
      reason: 'AI accelerator demand remains high across data centers and gaming.',
    },
    {
      ticker: 'Alphabet (GOOGL)',
      reason: 'Advertising recovery plus AI investments support long-term growth.',
    },
    {
      ticker: 'Tesla (TSLA)',
      reason: 'Electric vehicle demand and energy business continue to expand.',
    },
  ]);

  return (
    <Box sx={{ mt: 6 }}>
      <Paper sx={{ p: 3, backgroundColor: '#fff', borderRadius: 3, boxShadow: 3 }}>
        <Typography variant="h5" component="h2" gutterBottom>
          Stock Advisor
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Based on current market trends and company performance, here are some stock recommendations for investors to consider:
        </Typography>
        <List disablePadding>
          {recommendation.map((item, index) => (
            <ListItem key={item.ticker} sx={{ p: 1, borderBottom: index < recommendation.length - 1 ? '1px solid #e0e0e0' : 'none' }}>
              <ListItemText
                primary={item.ticker}
                secondary={item.reason}
                primaryTypographyProps={{ fontWeight: 600 }}
                secondaryTypographyProps={{ color: 'text.secondary' }}
              />
            </ListItem>
          ))}
        </List>
      </Paper>
    </Box>
  );
};

export default StockAdvisor;

