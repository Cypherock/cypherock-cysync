export const onboarding = {
  info: {
    name: 'onboarding-info',
    path: '/onboarding/info',
  },
  usage: {
    name: 'onboarding-usage',
    path: '/onboarding/usage',
  },
  terms: {
    name: 'onboarding-terms',
    path: '/onboarding/terms',
  },
  setPassword: {
    name: 'onboarding-set-password',
    path: '/onboarding/password',
  },
  emailAuth: {
    name: 'onboarding-email-auth',
    path: '/onboarding/email',
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
  deviceUpdate: {
    name: 'onboarding-device-update',
    path: '/onboarding/device-update',
  },
} as const;

export type OnboardingRouteName =
  (typeof onboarding)[keyof typeof onboarding]['name'];
