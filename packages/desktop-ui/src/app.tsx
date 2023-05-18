import React from 'react';
import {
  Splash,
  ThemeProvider,
  getDefaultTheme,
  DeviceProvider,
} from '@cypherock/cysync-core';

const theme = getDefaultTheme();

const App = () => (
  <ThemeProvider theme={theme}>
    <DeviceProvider
      getDevices={window.electronAPI.getDevices}
      connectDevice={window.electronAPI.connectDevice}
    >
      <Splash />
    </DeviceProvider>
  </ThemeProvider>
);

export default App;
