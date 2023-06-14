import React from 'react';
import {
  ThemeProvider,
  getDefaultTheme,
  DeviceProvider,
  StoreProvider,
  store,
  GlobalStyles,
  LockscreenBoundary,
  LockscreenProvider,
} from '@cypherock/cysync-core';
import { AppRouter } from './Router';

const theme = getDefaultTheme();

const App = () => (
  <ThemeProvider theme={theme}>
    <GlobalStyles />
    <LockscreenProvider>
      <LockscreenBoundary>
        <StoreProvider store={store}>
          <DeviceProvider
            getDevices={window.electronAPI.getDevices}
            connectDevice={window.electronAPI.connectDevice}
          >
            <AppRouter />
          </DeviceProvider>
        </StoreProvider>
      </LockscreenBoundary>
    </LockscreenProvider>
  </ThemeProvider>
);

export default App;
