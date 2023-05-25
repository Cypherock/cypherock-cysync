interface IRouteInfo {
  name: string;
  path: string;
}

export const onboardingRoutes: Record<string, IRouteInfo> = {
  information: {
    name: 'information',
    path: '/',
  },
  usage: {
    name: 'usage',
    path: '/usage',
  },
  terms: {
    name: 'terms',
    path: '/terms',
  },
  deviceDetection: {
    name: 'device-detection',
    path: '/device-detection',
  },
  deviceAuthentication: {
    name: 'device-authentication',
    path: '/device-authentication',
  },
};
