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
    <StoreProvider store={store}>
      <LockscreenProvider>
        <LockscreenBoundary>
          <DeviceProvider
            getDevices={window.electronAPI.getDevices}
            connectDevice={window.electronAPI.connectDevice}
          >
            <AppRouter />
          </DeviceProvider>
        </LockscreenBoundary>
      </LockscreenProvider>
    </StoreProvider>
  </ThemeProvider>
);

export default App;
