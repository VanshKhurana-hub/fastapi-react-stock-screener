import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Typography, Grid, Paper, Box } from '@mui/material';

const TopMovers = () => {
  const [gainers, setGainers] = useState([]);
  const [losers, setLosers] = useState([]);

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/top-movers')
      .then(res => {
        const allMovers = res.data || [];
        setGainers(allMovers.filter(stock => stock.change_percent > 0));
        setLosers(allMovers.filter(stock => stock.change_percent < 0));
      })
      .catch(err => console.error(err));
  }, []);

  const renderStockCard = (stock, isGainer) => (
    <Paper key={stock.ticker} sx={{ p: 2, mb: 2, borderLeft: `4px solid ${isGainer ? 'green' : 'red'}` }}>
      <Typography variant="subtitle1"><strong>{stock.ticker}</strong></Typography>
      <Typography>Price: ₹{stock.price}</Typography>
      <Typography>
        Change: {stock.change_percent > 0 ? "+" : ""}
        {stock.change_percent}%
      </Typography>
    </Paper>
  );

  return (
    <Box sx={{ mt: 6 }}>
      <Typography variant="h5" gutterBottom>📈 Top Movers</Typography>
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Typography variant="h6">🔼 Top Gainers</Typography>
          {gainers.map(stock => renderStockCard(stock, true))}
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="h6">🔽 Top Losers</Typography>
          {losers.map(stock => renderStockCard(stock, true))}
        </Grid>
      </Grid>
    </Box>
  );
};

export default TopMovers;
