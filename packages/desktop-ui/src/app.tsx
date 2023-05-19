import React from 'react';
import { Route, HashRouter as Router, Routes } from 'react-router-dom';
import {
  DeviceAuthTest,
  Information,
  Terms,
  ThemeProvider,
  Usage,
  Welcome,
  getDefaultTheme,
  DeviceProvider,
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
          <Route path="/" element={<Information />} />
          <Route path="/usage" element={<Usage />} />
          <Route path="/welcome" element={<Welcome />} />
          <Route path="/termsOfUse" element={<Terms />} />
          <Route path="/deviceAuthTest" element={<DeviceAuthTest />} />
        </Routes>
      </Router>
    </DeviceProvider>
  </ThemeProvider>
);

export default App;
