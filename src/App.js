import React from 'react';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import ImageToSvgConverter from './ImageToSvgConverter';

const theme = createTheme();

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ImageToSvgConverter />
    </ThemeProvider>
  );
}

export default App;