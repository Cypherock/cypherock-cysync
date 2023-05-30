import { IRouteInfo } from './types';

export const onboarding: Record<string, IRouteInfo> = {
  walletActions: {
    name: 'wallet-actions',
    path: '/',
  },
  joystickTraining: {
    name: 'joystick-training',
    path: '/joystick',
  },
  deviceDetection: {
    name: 'device-detection',
    path: '/device-detection',
  },
  deviceAuthentication: {
    name: 'device-authentication',
    path: '/auth',
  },
};
