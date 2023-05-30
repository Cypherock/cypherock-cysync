import {
  DeviceAuthentication,
  DeviceDetection,
  Information,
  Terms,
  Usage,
  routes,
} from '@cypherock/cysync-core';
import React, { ReactNode, memo } from 'react';

import { Route, HashRouter as Router, Routes } from 'react-router-dom';

const components: Record<keyof typeof routes.onboardingRoutes, ReactNode> = {
  information: <Information />,
  usage: <Usage />,
  terms: <Terms />,
  deviceDetection: <DeviceDetection />,
  deviceAuthentication: <DeviceAuthentication />,
};
export const AppRouter = memo(() => {
  const routesObj = Object.keys(routes.onboardingRoutes).map(key => {
    const obj = routes.onboardingRoutes[key];
    return <Route key={obj.name} path={obj.path} element={components[key]} />;
  });
  return (
    <Router>
      <Routes>{routesObj}</Routes>
    </Router>
  );
});
