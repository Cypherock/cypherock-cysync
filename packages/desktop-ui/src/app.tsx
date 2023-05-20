import React from 'react';
import { Route, HashRouter as Router, Routes } from 'react-router-dom';
import {
  ThemeProvider,
  getDefaultTheme,
  DeviceProvider,
  DeviceDetection,
  DeviceAuthentication,
} from '@cypherock/cysync-core';
import { GlobalStyles } from '@cypherock/cysync-core/src/styles/global.styled';

const theme = getDefaultTheme();

const App = () => (
  <ThemeProvider theme={theme}>
    <DeviceProvider
      getDevices={window.electronAPI.getDevices}
      connectDevice={window.electronAPI.connectDevice}
    >
      <Router>
        <GlobalStyles />
        <Routes>
          <Route path="/" element={<DeviceDetection />} />
          <Route path="/auth" element={<DeviceAuthentication />} />
        </Routes>
      </Router>
    </DeviceProvider>
  </ThemeProvider>
);

export default App;
