import { IRouteInfo } from './types';

export const onboarding: Record<string, IRouteInfo> = {
  joystickTraining: {
    name: 'joystick-training',
    path: '/joystick',
  },
  deviceDetection: {
    name: 'device-detection',
    path: '/',
  },
  deviceAuthentication: {
    name: 'device-authentication',
    path: '/auth',
  },
};
