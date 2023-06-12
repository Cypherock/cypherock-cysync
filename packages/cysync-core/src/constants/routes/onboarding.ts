export const onboarding = {
  info: {
    name: 'onboarding-info',
    path: '/',
  },
  usage: {
    name: 'onboarding-usage',
    path: '/onboarding/usage',
  },
  terms: {
    name: 'onboarding-terms',
    path: '/onboarding/terms',
  },
  deviceDetection: {
    name: 'onboarding-device-detection',
    path: '/onboarding/device-detection',
  },
  deviceAuthentication: {
    name: 'onboarding-device-authentication',
    path: '/onboarding/device-authentication',
  },
  joystickTraining: {
    name: 'onboarding-joystick-training',
    path: '/onboarding/joystick',
  },
  cardTraining: {
    name: 'onboarding-card-training',
    path: '/onboarding/card-training',
  },
  cardAuthentication: {
    name: 'onboarding-card-authentication',
    path: '/onboarding/card-auth',
  },
  congratulations: {
    name: 'onboarding-congratulations',
    path: '/onboarding/congo',
  },
  appUpdate: {
    name: 'onboarding-app-update',
    path: '/onboarding/app-update',
  },
  appUpdating: {
    name: 'onboarding-app-updating',
    path: '/onboarding/app-updating',
  },
} as const;

export type OnboardingRouteName =
  (typeof onboarding)[keyof typeof onboarding]['name'];
