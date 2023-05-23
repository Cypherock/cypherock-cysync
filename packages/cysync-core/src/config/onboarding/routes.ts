interface IRouteInfo {
  name: string;
  path: string;
}

export const onboardingRoutes: Record<string, IRouteInfo> = {
  deviceDetection: {
    name: 'device-detection',
    path: '/',
  },
  deviceAuthentication: {
    name: 'device-authentication',
    path: '/auth',
  },
};
