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
  BuySellProvider,
  SwapProvider,
  SnackBarManager,
} from '@cypherock/cysync-core';
import { FallbackRenderer, GlobalStyles } from '@cypherock/cysync-ui';
import React from 'react';

import { AppRouter } from './Router';

import { ErrorBoundary } from 'react-error-boundary';
import logger from './utils/logger';

const theme = getDefaultTheme();

const App = () => (
  <ThemeProvider theme={theme}>
    <GlobalStyles />
    <ErrorBoundary
      fallbackRender={FallbackRenderer}
      onReset={details => {
        logger.error(details);
        window.electronAPI.restartApp();
      }}
    >
      <StoreProvider store={store}>
        <LockscreenProvider>
          <LockscreenBoundary>
            <DeviceProvider
              getDevices={window.electronAPI.getDevices}
              connectDevice={window.electronAPI.connectDevice}
              addUsbChangeListener={window.electronAPI.addUsbChangeListener}
              removeUsbChangeListener={
                window.electronAPI.removeUsbChangeListener
              }
            >
              <AppUpdateProvider>
                <LatestDeviceVersionProvider>
                  <WalletConnectProvider>
                    <SwapProvider>
                      <BuySellProvider>
                        <AppRouter>
                          <SnackBarManager />
                          <DialogManager />
                          <BackgroundTasks />
                        </AppRouter>
                      </BuySellProvider>
                    </SwapProvider>
                  </WalletConnectProvider>
                </LatestDeviceVersionProvider>
              </AppUpdateProvider>
            </DeviceProvider>
          </LockscreenBoundary>
        </LockscreenProvider>
      </StoreProvider>
    </ErrorBoundary>
  </ThemeProvider>
);

export default App;
