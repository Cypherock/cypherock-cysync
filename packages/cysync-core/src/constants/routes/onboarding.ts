import { IRouteInfo } from './types';

export const onboarding: Record<string, IRouteInfo> = {
  createNewWallet: {
    name: 'create-new-wallet',
    path: '/',
  },
  deviceDetection: {
    name: 'device-detection',
    path: '/device-detection',
  },
  deviceAuthentication: {
    name: 'device-authentication',
    path: '/auth',
  },
  joystickTraining: {
    name: 'joystick-training',
    path: '/joystick',
  },
  cardTraining: {
    name: 'card-training',
    path: '/card-training',
  },
  cardAuthentication: {
    name: 'card-authentication',
    path: '/card-auth',
  },
  congratulations: {
    name: 'congratulations',
    path: '/congo',
  },
};
