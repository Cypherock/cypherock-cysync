import {
  SidebarProvider,
  EmailAuth,
  CardAuthentication,
  CardTraining,
  Congratulations,
  DeviceAuthentication,
  DeviceDetection,
  DeviceUpdate,
  Information,
  IRoute,
  JoystickTraining,
  PermissionSetup,
  Portfolio,
  Wallet,
  History,
  Settings,
  RouteName,
  routes,
  Terms,
  Usage,
  SetPassword,
  AppUpdate,
  AssetPage,
  AccountPage,
  BuySell,
  InheritanceHome,
  InheritanceChoosePlan,
  InheritancePlanDetails,
  ReferAndEarn,
  Swap,
  analyticsService,
  StakingLending,
} from '@cypherock/cysync-core';
import React, { memo, ReactNode, useEffect } from 'react';
import {
  HashRouter as Router,
  Route,
  Routes,
  useLocation,
} from 'react-router-dom';

const components: Record<RouteName, ReactNode> = {
  'permission-setup': <PermissionSetup />,
  'onboarding-info': <Information />,
  'onboarding-usage': <Usage />,
  'onboarding-terms': <Terms />,
  'onboarding-set-password': <SetPassword />,
  'onboarding-email-auth': <EmailAuth />,
  'onboarding-device-detection': <DeviceDetection />,
  'onboarding-device-authentication': <DeviceAuthentication />,
  'onboarding-joystick-training': <JoystickTraining />,
  'onboarding-card-training': <CardTraining />,
  'onboarding-card-authentication': <CardAuthentication />,
  'onboarding-congratulations': <Congratulations />,
  'onboarding-app-update': <AppUpdate />,
  'onboarding-device-update': <DeviceUpdate />,
  portfolio: <Portfolio />,
  wallet: <Wallet />,
  asset: <AssetPage />,
  account: <AccountPage />,
  history: <History />,
  settings: <Settings />,
  'buy-sell': <BuySell />,
  swap: <Swap />,
  inheritance: <InheritanceHome />,
  'inheritance-choose-plan': <InheritanceChoosePlan />,
  'inheritance-plan-details': <InheritancePlanDetails />,
  'refer-and-earn': <ReferAndEarn />,
  'staking-lending': <StakingLending />,
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

const getRoute = (parseRoutes: IRoutes): IRoute[] => {
  const allRoutes: IRoute[] = [];
  for (const route in parseRoutes) {
    if (parseRoutes[route]) allRoutes.push(...getPaths(parseRoutes[route]));
  }
  return allRoutes;
};

const PageTracker: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    const currentRoute = getRoute(routes).find(
      route => route.path === location.pathname,
    );
    const pageTitle = currentRoute?.name ?? 'Unknown Page';

    analyticsService.trackPageView(pageTitle, window.location.href);
  }, [location.pathname]);

  return null;
};

const BaseAppRouter: React.FC<{ children: ReactNode | undefined }> = ({
  children,
}) => (
  <Router>
    <SidebarProvider>
      <PageTracker />
      <Routes>
        {getRoute(routes).map(route => (
          <Route
            key={route.name}
            path={route.path}
            element={components[route.name]}
          />
        ))}
      </Routes>
      {children}
    </SidebarProvider>
  </Router>
);

export const AppRouter = memo(BaseAppRouter);
