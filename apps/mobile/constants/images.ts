import config from '@/config';

const defaultImages = {
  onboarding: {
    welcome: require('@/assets/images/welcome-screen.png'),
    screen1: require('@/assets/images/onboarding-screen-1.png'),
    screen2: require('@/assets/images/onboarding-screen-2.png'),
    screen3: require('@/assets/images/onboarding-screen-3.png'),
    screen4: require('@/assets/images/onboarding-screen-4.png'),
    screen4_1: require('@/assets/images/onboarding-screen-4.1.png'),
    screen4_2: require('@/assets/images/onboarding-screen-4.2.png'),
    screen5: require('@/assets/images/onboarding-screen-5.png'),
    qr_frame: require('@/assets/images/qr-frame.png'),
    camera: require('@/assets/images/carbon-camera.png'),
  },
  icon: {
    arrow_backword_default: require('@/assets/images/icons/arrow_backword_default.png'),
    arrow_backword_disabed: require('@/assets/images/icons/arrow_backword_disabed.png'),
    arrow_close_default: require('@/assets/images/icons/arrow_close_default.png'),
    arrow_close_disabed: require('@/assets/images/icons/arrow_close_disabed.png'),
    arrow_forward_default: require('@/assets/images/icons/arrow_forward_default.png'),
    arrow_forward_disabed: require('@/assets/images/icons/arrow_forward_disabed.png'),
    arrow_open_default: require('@/assets/images/icons/arrow_open_default.png'),
    arrow_open_disabed: require('@/assets/images/icons/arrow_open_disabed.png'),
    close_default: require('@/assets/images/icons/close_default.png'),
    close_disabed: require('@/assets/images/icons/close_disabed.png'),
    help_default: require('@/assets/images/icons/help_default.png'),
    help_disabled: require('@/assets/images/icons/help_disabled.png'),
    history_active: require('@/assets/images/icons/history_active.png'),
    history_default: require('@/assets/images/icons/history_default.png'),
    history_disabed: require('@/assets/images/icons/history_disabed.png'),
    notification_default: require('@/assets/images/icons/notification_default.png'),
    notification_disabed: require('@/assets/images/icons/notification_disabed.png'),
    notification_plain_default: require('@/assets/images/icons/notification_plain_default.png'),
    notification_plain_disabed: require('@/assets/images/icons/notification_plain_disabed.png'),
    portfolio_active: require('@/assets/images/icons/portfolio_active.png'),
    portfolio_default: require('@/assets/images/icons/portfolio_default.png'),
    portfolio_disabled: require('@/assets/images/icons/portfolio_disabled.png'),
    qr_default: require('@/assets/images/icons/qr_default.png'),
    qr_disabed: require('@/assets/images/icons/qr_disabed.png'),
    received_active: require('@/assets/images/icons/received_active.png'),
    received_default: require('@/assets/images/icons/received_default.png'),
    received_disabled: require('@/assets/images/icons/received_disabled.png'),
    settings_active: require('@/assets/images/icons/settings_active.png'),
    settings_default: require('@/assets/images/icons/settings_default.png'),
    settings_disabed: require('@/assets/images/icons/settings_disabed.png'),
    support_active: require('@/assets/images/icons/support_active.png'),
    support_default: require('@/assets/images/icons/support_default.png'),
    support_disabed: require('@/assets/images/icons/support_disabed.png'),
    thunder_default: require('@/assets/images/icons/thunder_default.png'),
    thunder_disabed: require('@/assets/images/icons/thunder_disabed.png'),
    wallet_default: require('@/assets/images/icons/wallet_default.png'),
  },
  other: {
    banner_default: require('@/assets/images/banner.png'),
    logo: require('@/assets/images/logo-lock.png'),
  },
};

// Odix images: override only vendor-specific branding assets.
// When odix-specific assets are available, place them under
// assets/images/odix/ and update the require paths below.
const odixImages = {
  ...defaultImages,
  // Override branding images when odix assets become available:
  // other: {
  //   ...defaultImages.other,
  //   banner_default: require('@/assets/images/odix/banner.png'),
  //   logo: require('@/assets/images/odix/logo-lock.png'),
  // },
};

export const Images = config.VENDOR === 'odix' ? odixImages : defaultImages;
