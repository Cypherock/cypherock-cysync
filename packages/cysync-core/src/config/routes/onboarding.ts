import { IRouteInfo } from './types';

export const onboarding: Record<string, IRouteInfo> = {
  joystickTraining: {
    name: 'joystick-training',
    path: '/joystick',
  },
  information: {
    name: 'information',
    path: '/',
  },
  usage: {
    name: 'usage',
    path: '/usage',
  },
  terms: {
    name: 'terms',
    path: '/terms',
  },
  deviceDetection: {
    name: 'device-detection',
    path: '/device-detection',
  },
  deviceAuthentication: {
    name: 'device-authentication',
    path: '/device-authentication',
  },
};
