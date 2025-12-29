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
  BuySell2Provider,
  SwapProvider,
  SnackBarManager,
  CurrencyProvider,
} from '@cypherock/cysync-core';
import { FallbackRenderer, GlobalStyles } from '@cypherock/cysync-ui';
import React from 'react';
import { ErrorBoundary } from 'react-error-boundary';

import { AppRouter } from './Router';
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
        <CurrencyProvider>
          <LockscreenProvider>
            <LockscreenBoundary>
              <DeviceProvider
                getDevices={window.electronAPI.getDevices}
                connectDevice={window.electronAPI.connectDevice}
                addUsbChangeListener={window.electronAPI.addUsbChangeListener}
                removeUsbChangeListener={
                  window.electronAPI.removeUsbChangeListener
                }
                updateDeviceFirmware={window.electronAPI.updateDeviceFirmware}
                addUpdateDeviceFirmwareProgressListener={
                  window.electronAPI.addUpdateDeviceFirmwareProgressListener
                }
                addUpdateDeviceFirmwareStatusListener={
                  window.electronAPI.addUpdateDeviceFirmwareStatusListener
                }
                removeUpdateDeviceFirmwareListeners={
                  window.electronAPI.removeUpdateDeviceFirmwareListeners
                }
                authenticateDevice={window.electronAPI.authenticateDevice}
              >
                <AppUpdateProvider>
                  <LatestDeviceVersionProvider>
                    <WalletConnectProvider>
                      <SwapProvider>
                        <BuySell2Provider>
                          <AppRouter>
                            <SnackBarManager />
                            <DialogManager />
                            <BackgroundTasks />
                          </AppRouter>
                        </BuySell2Provider>
                      </SwapProvider>
                    </WalletConnectProvider>
                  </LatestDeviceVersionProvider>
                </AppUpdateProvider>
              </DeviceProvider>
            </LockscreenBoundary>
          </LockscreenProvider>
        </CurrencyProvider>
      </StoreProvider>
    </ErrorBoundary>
  </ThemeProvider>
);

export default App;
