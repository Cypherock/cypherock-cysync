import { IRouteInfo } from './types';

export const onboarding: Record<string, IRouteInfo> = {
  deviceDetection: {
    name: 'device-detection',
    path: '/',
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
