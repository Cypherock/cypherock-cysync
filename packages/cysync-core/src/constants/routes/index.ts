import { inheritance, InheritanceRouteName } from './inheritance';
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
  buysell: {
    name: 'buy-sell',
    path: '/buy-sell',
  },
  swap: {
    name: 'swap',
    path: '/swap',
  },
  referAndEarn: {
    name: 'refer-and-earn',
    path: '/refer-and-earn',
  },
} as const;

export const routes = {
  onboarding,
  inheritance,
  ...rootRoutes,
};

type RootRouteName = (typeof rootRoutes)[keyof typeof rootRoutes]['name'];

export type RouteName =
  | RootRouteName
  | OnboardingRouteName
  | InheritanceRouteName;

export interface IRoute {
  name: RouteName;
  path: string;
}
