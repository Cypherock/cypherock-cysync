import React from 'react';
import { Splash, ThemeProvider, getDefaultTheme } from '@cypherock/cysync-core';

const theme = getDefaultTheme();

const App = () => (
  <ThemeProvider theme={theme}>
    <Splash />
  </ThemeProvider>
);

export default App;
