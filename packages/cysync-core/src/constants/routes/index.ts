import { addAccount, AddAccountRouteName } from './addAccount';
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
  | AddAccountRouteName;
