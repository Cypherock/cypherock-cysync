import config from './config';
import baseFeatureFlags from './featureFlags';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { version } = require('./package.json');

// NOTE: Do not import react-native here. This file runs before polyfills,
// so Platform and other RN APIs are not yet available.
// OS is populated lazily after RN initializes.
const cysyncEnv = {
  LOG_LEVEL: config.LOG_LEVEL,
  BUILD_TYPE: config.BUILD_TYPE,
  API_CYPHEROCK: config.API_CYPHEROCK,
  IS_PRODUCTION: config.BUILD_TYPE === 'production' ? 'true' : 'false',
  IS_TEST: 'false',
  VERSION: version,
  VENDOR: config.VENDOR,
  OS: 'mobile',
};

const vendorFeatureFlags = (() => {
  const flags = { ...baseFeatureFlags };
  if (config.VENDOR === 'odix') {
    flags.COVER = false;
  }
  return flags;
})();

(global as any).cysyncEnv = cysyncEnv;
(global as any).cysyncFeatureFlags = vendorFeatureFlags;

Object.entries(cysyncEnv).forEach(([key, value]) => {
  process.env[key] = String(value);
});
