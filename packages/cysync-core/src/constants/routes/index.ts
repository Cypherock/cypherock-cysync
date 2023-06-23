import { OnboardingRouteName, onboarding } from './onboarding';

const rootRoutes = {
  permissionSetup: {
    name: 'permission-setup',
    path: '/permission-setup',
  },
  portfolio: {
    name: 'portfolio',
    path: '/portfolio',
  },
} as const;

export const routes = {
  onboarding,
  ...rootRoutes,
};

type RootRouteName = (typeof rootRoutes)[keyof typeof rootRoutes]['name'];

export * from './types';
export type RouteName = RootRouteName | OnboardingRouteName;
