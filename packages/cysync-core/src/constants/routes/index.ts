import { OnboardingRouteName, onboarding } from './onboarding';
import { addAccount, addAccountRouteName } from './addAccount';

const rootRoutes = {
  permissionSetup: {
    name: 'permission-setup',
    path: '/',
  },
  portfolio: {
    name: 'portfolio',
    path: '/portfolio',
  },
} as const;

export const routes = {
  onboarding,
  addAccount,
  ...rootRoutes,
};

type RootRouteName = (typeof rootRoutes)[keyof typeof rootRoutes]['name'];

export * from './types';
export type RouteName =
  | RootRouteName
  | OnboardingRouteName
  | addAccountRouteName;
