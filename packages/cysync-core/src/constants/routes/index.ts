import { OnboardingRouteName, onboarding } from './onboarding';

const rootRoutes = {
  permissionSetup: {
    name: 'permission-setup',
    path: '/',
  },
  portfolio: {
    name: 'portfolio',
    path: '/portfolio',
  },
  wallet: {
    name: 'wallet',
    path: '/wallet',
  },
  asset: {
    name: 'asset',
    path: '/asset',
  },
  account: {
    name: 'account',
    path: '/account',
  },
  history: {
    name: 'history',
    path: '/history',
  },
  settings: {
    name: 'settings',
    path: '/settings',
  },
} as const;

export const routes = {
  onboarding,
  ...rootRoutes,
};

type RootRouteName = (typeof rootRoutes)[keyof typeof rootRoutes]['name'];

export type RouteName = RootRouteName | OnboardingRouteName;

export interface IRoute {
  name: RouteName;
  path: string;
}
