import { OnboardingRouteName, onboarding } from './onboarding';

const rootRoutes = {
  portfolio: {
    name: 'portfolio',
    path: '/portfolio', // TODO: change to '/'
  },
} as const;
export const routes = {
  onboarding,
  ...rootRoutes,
};

type RootRouteName = (typeof rootRoutes)[keyof typeof rootRoutes]['name'];

export * from './types';
export type RouteName = RootRouteName | OnboardingRouteName;
