import { app } from 'electron';
import jsonConfig from '../../config';

const configValidators = {
  API_CYPHEROCK: (val?: string) => val?.startsWith('http') ?? false,
  BUILD_TYPE: (val?: string) => ['production', 'debug'].includes(val as any),
  LOG_LEVEL: (val?: string) =>
    ['error', 'warn', 'info', 'verbose', 'debug'].includes(val as any),
  BUILD_VERSION: (val?: string) => !!val,
  SIMULATE_PRODUCTION: (val?: boolean) => typeof val === 'boolean',
  ALLOW_PRERELEASE: (val?: boolean) => typeof val === 'boolean',
} as const;

const validateJsonConfig = () => {
  for (const key in configValidators) {
    if (!(configValidators as any)[key]((jsonConfig as any)[key])) {
      throw new Error(`Invalid ${key} in json config`);
    }
  }
};

const getFromExternalEnv = (key: string) => {
  const validator = (configValidators as any)[key];
  if (
    validator &&
    typeof process.env[key] !== 'undefined' &&
    validator(process.env[key])
  ) {
    return process.env[key];
  }

  return undefined;
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
const getConfig = () => {
  validateJsonConfig();

  const config = {
    LOG_LEVEL: '',
    BUILD_TYPE: '',
    API_CYPHEROCK: '',
    BUILD_VERSION: '',
    IS_PRODUCTION: true,
    IS_TEST: false,
    ALLOW_PRERELEASE: false,
    USER_DATA_PATH: '',
  };

  config.BUILD_TYPE = jsonConfig.BUILD_TYPE;
  config.BUILD_VERSION = jsonConfig.BUILD_VERSION;
  config.ALLOW_PRERELEASE = jsonConfig.ALLOW_PRERELEASE;

  if (!app && process.env.NODE_ENV === 'test') {
    config.USER_DATA_PATH = '.';
  } else {
    config.USER_DATA_PATH = app.getPath('userData');
  }

  // Treat test as a production environment
  if (
    ['production', 'test'].includes(process.env.NODE_ENV?.toLowerCase() as any)
  ) {
    config.IS_PRODUCTION = true;
  } else if (jsonConfig.SIMULATE_PRODUCTION) {
    config.IS_PRODUCTION = true;
  } else {
    config.IS_PRODUCTION = false;
  }

  // These variables can be overridden from external env
  config.LOG_LEVEL = getFromExternalEnv('LOG_LEVEL') ?? jsonConfig.LOG_LEVEL;
  config.API_CYPHEROCK =
    getFromExternalEnv('API_CYPHEROCK') ?? jsonConfig.API_CYPHEROCK;

  return config;
};

export const config = getConfig();
for (const key in config) {
  if (key in config) {
    process.env[key] = (config as any)[key];
  }
}
