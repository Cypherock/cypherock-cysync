import * as typesRoutes from '@cypherock/cysync-core';
import {
  CardAuthentication,
  CardTraining,
  Congratulations,
  DeviceAuthentication,
  DeviceDetection,
  Information,
  Usage,
  JoystickTraining,
  routes,
  Terms,
} from '@cypherock/cysync-core';
import React, { ReactNode, memo } from 'react';
import { Route, HashRouter as Router, Routes } from 'react-router-dom';

const components: Record<string, ReactNode> = {
  info: <Information />,
  usage: <Usage />,
  terms: <Terms />,
  'device-detection': <DeviceDetection />,
  'device-authentication': <DeviceAuthentication />,
  'joystick-training': <JoystickTraining />,
  'card-training': <CardTraining />,
  'card-authentication': <CardAuthentication />,
  congratulations: <Congratulations />,
  portfolio: <div>portfolio</div>,
};

const getPaths = (
  route: typesRoutes.IRoute | typesRoutes.InternalRoute,
): typesRoutes.IRoute[] => {
  if (route.path === undefined) {
    const internalRoute = route as typesRoutes.InternalRoute;
    const allRoutes: typesRoutes.IRoute[] = [];
    for (const internalRouteKey in internalRoute) {
      if (internalRoute[internalRouteKey])
        allRoutes.push(...getPaths(internalRoute[internalRouteKey]));
    }
    return allRoutes;
  }
  return [route as typesRoutes.IRoute];
};

const getRoute = (parseRoutes: typesRoutes.Routes) => {
  const allRoutes: typesRoutes.IRoute[] = [];
  for (const route in parseRoutes) {
    if (parseRoutes[route]) allRoutes.push(...getPaths(parseRoutes[route]));
  }
  return allRoutes;
};

export const AppRouter = memo(() => {
  const allRoutes = getRoute(routes).map(route => (
    <Route
      key={route.name}
      path={route.path}
      element={components[route.name]}
    />
  ));
  return (
    <Router>
      <Routes>{allRoutes}</Routes> TODO: redirect to device detection page if
      device not connected
    </Router>
  );
});
