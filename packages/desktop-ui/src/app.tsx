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
  AppUpdateProvider,
  LatestDeviceVersionProvider,
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
          >
            <AppUpdateProvider>
              <LatestDeviceVersionProvider>
                <AppRouter>
                  <DialogManager />
                  <BackgroundTasks />
                </AppRouter>
              </LatestDeviceVersionProvider>
            </AppUpdateProvider>
          </DeviceProvider>
        </LockscreenBoundary>
      </LockscreenProvider>
    </StoreProvider>
  </ThemeProvider>
);

export default App;
