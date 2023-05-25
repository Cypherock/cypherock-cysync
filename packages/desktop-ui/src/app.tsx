import React from 'react';
import {
  ThemeProvider,
  getDefaultTheme,
  DeviceProvider,
  StoreProvider,
  store,
  GlobalStyles,
} from '@cypherock/cysync-core';
import { AppRouter } from './Router';

const theme = getDefaultTheme();

const App = () => (
  <ThemeProvider theme={theme}>
    <StoreProvider store={store}>
      <DeviceProvider
        getDevices={window.electronAPI.getDevices}
        connectDevice={window.electronAPI.connectDevice}
      >
        <GlobalStyles />
        <AppRouter />
      </DeviceProvider>
    </StoreProvider>
  </ThemeProvider>
);

export default App;
