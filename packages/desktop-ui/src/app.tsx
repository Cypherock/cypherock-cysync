import React from 'react';
import {
  ThemeProvider,
  getDefaultTheme,
  DeviceProvider,
  GlobalStyles,
} from '@cypherock/cysync-core';
import { AppRouter } from './Router';

const theme = getDefaultTheme();

const App = () => (
  <ThemeProvider theme={theme}>
    <DeviceProvider
      getDevices={window.electronAPI.getDevices}
      connectDevice={window.electronAPI.connectDevice}
    >
      <GlobalStyles />
      <AppRouter />
    </DeviceProvider>
  </ThemeProvider>
);

export default App;
