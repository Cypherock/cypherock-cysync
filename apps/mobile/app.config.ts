import { ExpoConfig, ConfigContext, getPackageJson } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name:
    process.env.APP_ENV === 'production' ? config.name! : `${config.name!}-dev`,
  slug: config.slug ?? 'cysync',
  version: getPackageJson('./').version,
  ios: {
    ...config.ios,
  },
  android: {
    ...config.android,
    package:
      process.env.APP_ENV === 'production'
        ? 'com.cypherock.cysync'
        : 'com.cypherock.cysync_dev',
  },
});
