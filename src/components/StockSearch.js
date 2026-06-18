import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Typography, Box } from '@mui/material';

function StockSearch({ setStockData }) {
  const [ticker, setTicker] = useState('');
  const [error, setError] = useState('');

  const handleSearch = async () => {
    if (!ticker.trim()) return;

    try {
      const response = await axios.get(`http://127.0.0.1:8000/stock/${ticker}`);
      if (response.data.error) {
        setError(response.data.error);
        setStockData([]);
      } else {
        const stock = response.data;
        setStockData([
          {
            id: stock.ticker,
            ticker: stock.ticker,
            currentPrice: stock.current_price,
            marketCap: stock.market_cap,
          },
        ]);
        setError('');
      }
    } catch (err) {
      setError('Error fetching stock data');
      setStockData([]);
    }
  };

  return (
    <Box mb={4}>
      <Typography variant="h6" gutterBottom>Search Stock</Typography>
      <TextField
        label="Ticker Symbol"
        variant="outlined"
        value={ticker}
        onChange={(e) => setTicker(e.target.value.toUpperCase())}
        sx={{ marginRight: 2 }}
      />
      <Button variant="contained" onClick={handleSearch}>Search</Button>
      {error && <Typography color="error" mt={2}>{error}</Typography>}
    </Box>
  );
}

export default StockSearch;
