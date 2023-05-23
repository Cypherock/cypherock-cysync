import React from 'react';
import {
  Splash,
  ThemeProvider,
  getDefaultTheme,
  DeviceProvider,
  StoreProvider,
  store,
} from '@cypherock/cysync-core';

const theme = getDefaultTheme();

const App = () => (
  <ThemeProvider theme={theme}>
    <StoreProvider store={store}>
      <DeviceProvider
        getDevices={window.electronAPI.getDevices}
        connectDevice={window.electronAPI.connectDevice}
      >
        <Splash />
      </DeviceProvider>
    </StoreProvider>
  </ThemeProvider>
);

export default App;
