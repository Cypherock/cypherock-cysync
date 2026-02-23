import config from '@/config';

const defaultLottie = {
  splash: require('@/assets/lottie/splash.json'),
  loader: require('@/assets/lottie/loader.json'),
} as const;

const odixLottie = {
  splash: require('@/assets/lottie/splash-odix.json'),
  loader: require('@/assets/lottie/loader-odix.json'),
} as const;

/** Vendor-aware Lottie assets. Use for splash and loader screens. */
export const Lottie = config.VENDOR === 'odix' ? odixLottie : defaultLottie;
