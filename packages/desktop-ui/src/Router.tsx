import {
  DeviceAuthentication,
  DeviceDetection,
  Information,
  Terms,
  Usage,
  onboardingRoutes,
} from '@cypherock/cysync-core';
import React, { ReactNode, memo } from 'react';

import { Route, HashRouter as Router, Routes } from 'react-router-dom';

const components: Record<keyof typeof onboardingRoutes, ReactNode> = {
  information: <Information />,
  usage: <Usage />,
  terms: <Terms />,
  deviceDetection: <DeviceDetection />,
  deviceAuthentication: <DeviceAuthentication />,
};
export const AppRouter = memo(() => {
  const routes = Object.keys(onboardingRoutes).map(key => {
    const obj = onboardingRoutes[key];
    return <Route key={obj.name} path={obj.path} element={components[key]} />;
  });
  return (
    <Router>
      <Routes>{routes}</Routes>
    </Router>
  );
});
