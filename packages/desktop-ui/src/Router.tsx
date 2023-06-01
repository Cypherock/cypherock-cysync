import {
  CardAuthentication,
  CardTraining,
  Congratulations,
  DeviceAuthentication,
  DeviceDetection,
  JoystickTraining,
  WalletActionsDialogBox,
  routes,
} from '@cypherock/cysync-core';
import React, { ReactNode, memo } from 'react';
import { Route, HashRouter as Router, Routes } from 'react-router-dom';

const onboardingComponents: Record<keyof typeof routes.onboarding, ReactNode> =
  {
    walletActions: <WalletActionsDialogBox />,
    deviceDetection: <DeviceDetection />,
    deviceAuthentication: <DeviceAuthentication />,
    joystickTraining: <JoystickTraining />,
    cardTraining: <CardTraining />,
    cardAuthentication: <CardAuthentication />,
    congratulations: <Congratulations />,
  };
export const AppRouter = memo(() => {
  const allRoutes = Object.keys(onboardingComponents).map(key => {
    const obj = routes.onboarding[key];
    return (
      <Route
        key={obj.name}
        path={obj.path}
        element={onboardingComponents[key]}
      />
    );
  });
  return (
    <Router>
      <Routes>{allRoutes}</Routes>
    </Router>
  );
});
