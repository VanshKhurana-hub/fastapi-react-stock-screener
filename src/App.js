import React, { useState } from "react";
import StockSearch from "./components/StockSearch";
import StockTable from "./components/StockTable";
import TopMovers from "./components/TopMovers";
import StockAdvisor from "./components/StockAdvisor";
import { Container, Typography, Divider } from "@mui/material";

function App() {
  const [stockData, setStockData] = useState([]); // ✅ store searched stock data

  return (
    <Container maxWidth="lg" style={{ marginTop: "20px" }}>
      <Typography variant="h3" gutterBottom align="center">
        Stock Market Dashboard
      </Typography>

      {/* Pass setStockData to StockSearch */}
      <StockSearch setStockData={setStockData} />

      <Divider style={{ margin: "20px 0" }} />

      {/* Pass stockData to StockTable */}
      <StockTable stockData={stockData} />

      <Divider style={{ margin: "20px 0" }} />

      <TopMovers />

      <Divider style={{ margin: "20px 0" }} />

      <StockAdvisor />
    </Container>
  );
}

export default App;
