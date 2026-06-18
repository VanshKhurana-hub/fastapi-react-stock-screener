import React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Paper } from '@mui/material';

const columns = [
  { field: 'ticker', headerName: 'Ticker', width: 120 },
  { field: 'currentPrice', headerName: 'Current Price', width: 150 },
  { field: 'marketCap', headerName: 'Market Cap', width: 200 },
];

export default function StockTable({ stockData }) {
  return (
    <Paper sx={{ height: 150, width: '100%' }}>
      <DataGrid
        rows={stockData}
        columns={columns}
        getRowId={(row) => row.ticker}
        pageSizeOptions={[5]}
        checkboxSelection
        sx={{ border: 0 }}
      />
    </Paper>
  );
}
