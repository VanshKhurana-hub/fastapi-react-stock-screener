import React from 'react';
import { AppBar, Toolbar, Typography, Box, Chip, Container } from '@mui/material';

export default function Navbar() {
  return (
    <AppBar position="static" color="transparent" elevation={0} sx={{ borderBottom: '1px solid #e2e8f0', bgcolor: '#ffffff', mb: 3 }}>
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ justifyContent: 'space-between', py: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: 2,
                bgcolor: '#0f172a',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 18,
                fontWeight: 800,
              }}
            >
              📊
            </Box>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 800, lineHeight: 1.2, color: '#0f172a' }}>
                MarketPulse
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                Real-Time Stock Screener & Analytics
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Chip
              label="🟢 Live Data"
              size="small"
              sx={{
                bgcolor: '#ecfdf5',
                color: '#059669',
                fontWeight: 700,
                border: '1px solid #a7f3d0',
                display: { xs: 'none', sm: 'inline-flex' },
              }}
            />
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

