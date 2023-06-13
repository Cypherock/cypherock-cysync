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
  IRoute,
  RouteName,
} from '@cypherock/cysync-core';
import React, { ReactNode, memo } from 'react';
import { Route, HashRouter as Router, Routes } from 'react-router-dom';

const components: Record<RouteName, ReactNode> = {
  'onboarding-info': <Information />,
  'onboarding-usage': <Usage />,
  'onboarding-terms': <Terms />,
  'onboarding-device-detection': <DeviceDetection />,
  'onboarding-device-authentication': <DeviceAuthentication />,
  'onboarding-joystick-training': <JoystickTraining />,
  'onboarding-card-training': <CardTraining />,
  'onboarding-card-authentication': <CardAuthentication />,
  'onboarding-congratulations': <Congratulations />,
  portfolio: <div>portfolio</div>,
};

export type InternalRoute = Record<string, IRoute>;
export type IRoutes = Record<string, IRoute | InternalRoute>;

const getPaths = (route: IRoute | InternalRoute): IRoute[] => {
  if (route.path === undefined) {
    const internalRoute = route as InternalRoute;
    const allRoutes: IRoute[] = [];
    for (const internalRouteKey in internalRoute) {
      if (internalRoute[internalRouteKey])
        allRoutes.push(...getPaths(internalRoute[internalRouteKey]));
    }
    return allRoutes;
  }
  return [route as IRoute];
};

const getRoute = (parseRoutes: IRoutes) => {
  const allRoutes: IRoute[] = [];
  for (const route in parseRoutes) {
    if (parseRoutes[route]) allRoutes.push(...getPaths(parseRoutes[route]));
  }
  return allRoutes;
};

export const AppRouter = memo(() => (
  <Router>
    <Routes>
      {getRoute(routes).map(route => (
        <Route
          key={route.name}
          path={route.path}
          element={components[route.name]}
        />
      ))}
    </Routes>
  </Router>
));
