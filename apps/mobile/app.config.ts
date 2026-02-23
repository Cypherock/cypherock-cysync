import { ExpoConfig, ConfigContext, getPackageJson } from 'expo/config';
import config from './config';

/**
 * Read VENDOR from config.ts as the local source of truth.
 * process.env.VENDOR (set by EAS build profiles) takes precedence.
 */
function getVendor(): string {
  return process.env.VENDOR || config.VENDOR;
}

const vendor = getVendor();

function getAppName(): string {
  switch (vendor) {
    case 'odix':
      return 'Odix Pay';
    default:
      return 'cySync';
  }
}

function getIsDev(): boolean {
  return process.env.APP_ENV !== 'production';
}

function getAndroidPackage(): string {
  const isDev = getIsDev();
  switch (vendor) {
    case 'odix':
      return isDev ? 'com.odix.odixpay_dev' : 'com.odix.odixpay';
    default:
      return isDev ? 'com.cypherock.cysync_dev' : 'com.cypherock.cysync';
  }
}

function getIosBundleIdentifier(): string {
  const isDev = getIsDev();
  switch (vendor) {
    case 'odix':
      return isDev ? 'com.odix.odixpay-dev' : 'com.odix.odixpay';
    default:
      return isDev ? 'com.cypherock.cysync-dev' : 'com.cypherock.cysync';
  }
}

function getSlug(): string {
  switch (vendor) {
    case 'odix':
      return 'odixpay';
    default:
      return 'cysync';
  }
}

function getScheme(): string {
  switch (vendor) {
    case 'odix':
      return 'odixpay';
    default:
      return 'cysync';
  }
}

function getSplashBackgroundColor(): string {
  switch (vendor) {
    case 'odix':
      return '#141414';
    default:
      return '#1C1815';
  }
}

function getSplashImage(): string {
  switch (vendor) {
    case 'odix':
      return './assets/images/splash-icon-odix.png';
    default:
      return './assets/images/splash-icon.png';
  }
}

function getIcon(): string {
  switch (vendor) {
    case 'odix':
      return './assets/images/icon-odix.png';
    default:
      return './assets/images/icon.png';
  }
}

function getAdaptiveIcon(): {
  foregroundImage: string;
  backgroundImage: string;
} {
  switch (vendor) {
    case 'odix':
      return {
        foregroundImage: './assets/images/foreground-odix.png',
        backgroundImage: './assets/images/background-odix.png',
      };
    default:
      return {
        foregroundImage: './assets/images/foreground.png',
        backgroundImage: './assets/images/background.png',
      };
  }
}

function getGoogleServicesFile(): string {
  switch (vendor) {
    case 'odix':
      return './google-services-odix.json';
  }
  return './google-services.json';
}

function getVendorPlugins(
  basePlugins: ExpoConfig['plugins'],
): ExpoConfig['plugins'] {
  if (!basePlugins) return basePlugins;

  return basePlugins.map(plugin => {
    // Match the expo-splash-screen plugin (tuple format: ["expo-splash-screen", {...}])
    if (Array.isArray(plugin) && plugin[0] === 'expo-splash-screen') {
      return [
        'expo-splash-screen',
        {
          ...(typeof plugin[1] === 'object' ? plugin[1] : {}),
          image: getSplashImage(),
          backgroundColor: getSplashBackgroundColor(),
        },
      ];
    }
    return plugin;
  });
}

export default ({ config: baseConfig }: ConfigContext): ExpoConfig => {
  const appName = getAppName();
  const displayName =
    process.env.APP_ENV === 'production' ? appName : `${appName}-dev`;

  return {
    ...baseConfig,
    name: displayName,
    slug: getSlug(),
    scheme: getScheme(),
    icon: getIcon(),
    version: getPackageJson('./').version,
    ios: {
      ...baseConfig.ios,
      bundleIdentifier: getIosBundleIdentifier(),
    },
    android: {
      ...baseConfig.android,
      googleServicesFile: getGoogleServicesFile(),
      package: getAndroidPackage(),
      adaptiveIcon: getAdaptiveIcon(),
    },
    plugins: getVendorPlugins(baseConfig.plugins),
  };
};
