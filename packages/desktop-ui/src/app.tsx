import React from 'react';
import { ThemeProvider } from 'styled-components';
import { BrowserRouter as Router } from 'react-router-dom';
import { theme } from './themes/theme.styled';
import { GlobalStyles } from './styles/Global.styled.js';

export const App: React.FC = () => (
  <ThemeProvider theme={theme}>
    <Router>
      <GlobalStyles />
    </Router>
  </ThemeProvider>
);
