import {
  ThemeProvider,
  getDefaultTheme,
  DeviceProvider,
  StoreProvider,
  store,
  LockscreenBoundary,
  LockscreenProvider,
  BackgroundTasks,
  DialogManager,
  WalletConnectProvider,
  AppUpdateProvider,
  LatestDeviceVersionProvider,
  SnackBarManager,
} from '@cypherock/cysync-core';
import { GlobalStyles } from '@cypherock/cysync-ui';
import React from 'react';

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
            addUsbChangeListener={window.electronAPI.addUsbChangeListener}
            removeUsbChangeListener={window.electronAPI.removeUsbChangeListener}
          >
            <AppUpdateProvider>
              <LatestDeviceVersionProvider>
                <WalletConnectProvider>
                  <AppRouter>
                    <SnackBarManager />
                    <DialogManager />
                    <BackgroundTasks />
                  </AppRouter>
                </WalletConnectProvider>
              </LatestDeviceVersionProvider>
            </AppUpdateProvider>
          </DeviceProvider>
        </LockscreenBoundary>
      </LockscreenProvider>
    </StoreProvider>
  </ThemeProvider>
);

export default App;
