import {
  DeviceAuthentication,
  DeviceDetection,
  Information,
  Terms,
  Usage,
  JoystickTraining,
  routes,
} from '@cypherock/cysync-core';
import React, { ReactNode, memo } from 'react';

import { Route, HashRouter as Router, Routes } from 'react-router-dom';

const components: Record<keyof typeof routes.onboarding, ReactNode> = {
  information: <Information />,
  usage: <Usage />,
  terms: <Terms />,
  deviceDetection: <DeviceDetection />,
  deviceAuthentication: <DeviceAuthentication />,
  joystickTraining: <JoystickTraining />,
};
export const AppRouter = memo(() => {
  const routesObj = Object.keys(routes.onboarding).map(key => {
    const obj = routes.onboarding[key];
    return <Route key={obj.name} path={obj.path} element={components[key]} />;
  });
  return (
    <Router>
      <Routes>{routesObj}</Routes>
    </Router>
  );
});
