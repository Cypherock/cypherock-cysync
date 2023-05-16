import React from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import {
  Information,
  Terms,
  ThemeProvider,
  Usage,
  Welcome,
  getDefaultTheme,
} from '@cypherock/cysync-core';
import { GlobalStyles } from '@cypherock/cysync-core/src/styles/global.styled';

const theme = getDefaultTheme();

const App = () => (
  <ThemeProvider theme={theme}>
    <Router>
      <GlobalStyles />
      <Routes>
        <Route path="/" element={<Information />} />
        <Route path="/usage" element={<Usage />} />
        <Route path="/welcome" element={<Welcome />} />
        <Route path="/termsOfUse" element={<Terms />} />
      </Routes>
    </Router>
  </ThemeProvider>
);

export default App;
