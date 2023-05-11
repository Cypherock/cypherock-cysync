import { app } from 'electron';
import jsonConfig from '../../config';

const validateJsonConfig = () => {
  if (!jsonConfig.API_CYPHEROCK.startsWith('http')) {
    throw new Error('Invalid API_CYPHEROCK in json config');
  }

  if (!['production', 'debug'].includes(jsonConfig.BUILD_TYPE)) {
    throw new Error('Invalid BUILD_TYPE in json config');
  }

  if (
    !['error', 'warn', 'info', 'http', 'verbose', 'debug', 'silly'].includes(
      jsonConfig.LOG_LEVEL,
    )
  ) {
    throw new Error('Invalid LOG_LEVEL in json config');
  }

  // Build version is just the commit hash
  if (!jsonConfig.BUILD_VERSION) {
    throw new Error('No BUILD_VERSION in json config');
  }

  // When you want to enable production features on development (`pnpm start`)
  if (typeof jsonConfig.SIMULATE_PRODUCTION !== 'boolean') {
    throw new Error('Invalid SIMULATE_PRODUCTION in json config');
  }

  // When you want to enable the donwload of prerelease firmware
  if (typeof jsonConfig.ALLOW_PRERELEASE !== 'boolean') {
    throw new Error('Invalid ALLOW_PRERELEASE in json config');
  }
};

/**
 * `IS_PRODUCTION`:
 * This variable is used to enable or disable certain features depending on
 * if the app is in production mode or not.
 *
 * *********** Why not just use `NODE_ENV`? ************
 * We may want to simulate production environment in development mode.
 * In such cases, we can just set the `IS_PRODUCTION` to `true`.
 *
 * ******** When to use `NODE_ENV` and when to use `IS_PRODUCTION`? *********
 * `NODE_ENV`:
 * 1. Use to differentiate between development mode and production mode.
 * 2. We may have cases where different code works on different environments,
 *    such as path of icon etc. In these cases use `NODE_ENV`
 * 3. Use this to enable production features which you don't want to be simulated.
 *    Example: Crash Report, Analytics
 *
 * `IS_PRODUCTION`:
 * 1. Use to decide if we want to enable or disable a feature.
 * 2. Example: Websockets, Refresh on Startup etc.
 */
export const setConfig = () => {
  validateJsonConfig();

  if (!app && process.env.NODE_ENV === 'test') {
    process.env.USER_DATA_PATH = '.';
  } else {
    process.env.USER_DATA_PATH = app.getPath('userData');
  }

  process.env.LOG_LEVEL = jsonConfig.LOG_LEVEL;
  process.env.BUILD_TYPE = jsonConfig.BUILD_TYPE;
  process.env.API_CYPHEROCK = jsonConfig.API_CYPHEROCK;
  process.env.BUILD_VERSION = jsonConfig.BUILD_VERSION;

  if (jsonConfig.ALLOW_PRERELEASE) {
    process.env.ALLOW_PRERELEASE = 'true';
  } else {
    process.env.ALLOW_PRERELEASE = 'false';
  }

  // Treat test as a production environment
  if (
    ['production', 'test'].includes(process.env.NODE_ENV?.toLowerCase() as any)
  ) {
    process.env.IS_PRODUCTION = 'true';
  } else if (jsonConfig.SIMULATE_PRODUCTION) {
    process.env.IS_PRODUCTION = 'true';
  } else {
    process.env.IS_PRODUCTION = 'false';
  }
};

setConfig();

export const config = {
  LOG_LEVEL: process.env.LOG_LEVEL,
  BUILD_TYPE: process.env.BUILD_TYPE,
  API_CYPHEROCK: process.env.API_CYPHEROCK,
  BUILD_VERSION: process.env.BUILD_VERSION,
  IS_PRODUCTION: process.env.IS_PRODUCTION === 'true',
  IS_TEST: process.env.NODE_ENV?.toLowerCase() === 'test',
  ALLOW_PRERELEASE: process.env.ALLOW_PRERELEASE === 'true',
  USER_DATA_PATH: process.env.USER_DATA_PATH,
};
