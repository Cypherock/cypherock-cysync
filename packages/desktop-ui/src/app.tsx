import React from 'react';
import { ThemeProvider } from 'styled-components';
import { Splash } from '@cypherock/cysync-core';
import { theme } from '@cypherock/cysync-ui';

const App = () => (
  <ThemeProvider theme={theme}>
    <Splash />
  </ThemeProvider>
);

export default App;
