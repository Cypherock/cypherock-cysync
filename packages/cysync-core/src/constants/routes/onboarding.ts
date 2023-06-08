import { IRoute } from './types';

export const onboarding: Record<string, IRoute> = {
  info: {
    name: 'info',
    path: '/',
  },
  usage: {
    name: 'terms',
    path: '/onboarding/usage',
  },
  terms: {
    name: 'terms',
    path: '/onboarding/terms',
  },
  deviceDetection: {
    name: 'device-detection',
    path: '/onboarding/device-detection',
  },
  deviceAuthentication: {
    name: 'device-authentication',
    path: '/onboarding/device-authentication',
  },
  joystickTraining: {
    name: 'joystick-training',
    path: '/onboarding/joystick',
  },
  cardTraining: {
    name: 'card-training',
    path: '/onboarding/card-training',
  },
  cardAuthentication: {
    name: 'card-authentication',
    path: '/onboarding/card-auth',
  },

  congratulations: {
    name: 'congratulations',
    path: '/onboarding/congo',
  },
};
