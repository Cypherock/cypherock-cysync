import { IRouteInfo } from './types';

export const onboarding: Record<string, IRouteInfo> = {
  info: {
    name: 'info',
    path: '/',
  },
  usage: {
    name: 'terms',
    path: '/usage',
  },
  terms: {
    name: 'terms',
    path: '/terms',
  },
  setPassword: {
    name: 'set-password',
    path: '/password',
  },
  emailAuth: {
    name: 'email-auth',
    path: '/email',
  },
  deviceDetection: {
    name: 'device-detection',
    path: '/device-detection',
  },
  deviceAuthentication: {
    name: 'device-authentication',
    path: '/device-authentication',
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
