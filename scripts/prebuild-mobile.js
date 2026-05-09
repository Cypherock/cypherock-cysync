const path = require('path');
const fs = require('fs');

/**
 * Mobile prebuild script
 *
 * Rewrites apps/mobile/config.js with values derived from EAS build
 * environment variables so that the bundled config matches the build profile.
 *
 * Env vars consumed (all optional, sensible defaults apply):
 *   APP_ENV   – "production" | "development"  (from eas.json)
 *   VENDOR    – "default"   | "odix"          (from eas.json)
 *   API       – full API URL override         (from eas.json)
 *   LOG_LEVEL – override log level             (optional)
 */

const MOBILE_APP_PATH = path.join(__dirname, '..', 'apps', 'mobile');
const CONFIG_PATH = path.join(MOBILE_APP_PATH, 'config.js');

const ENV_CONFIG = {
  production: {
    BUILD_TYPE: 'production',
    LOG_LEVEL: 'error',
    API_CYPHEROCK: 'https://api.cypherock.com',
  },
  development: {
    BUILD_TYPE: 'debug',
    LOG_LEVEL: 'debug',
    API_CYPHEROCK: 'https://dev-api.cypherock.com',
  },
};

const run = () => {
  const appEnv = process.env.APP_ENV || 'development';
  const vendor = process.env.VENDOR || 'default';

  const base = ENV_CONFIG[appEnv] || ENV_CONFIG.development;

  const configValues = {
    BUILD_TYPE: base.BUILD_TYPE,
    LOG_LEVEL: process.env.LOG_LEVEL || base.LOG_LEVEL,
    API_CYPHEROCK: process.env.API || base.API_CYPHEROCK,
    VENDOR: vendor,
  };

  console.log('[prebuild-mobile] Writing config.js with:', configValues);

  let configStr = 'module.exports = {\n';
  for (const [key, value] of Object.entries(configValues)) {
    configStr += `  ${key}: '${value}',\n`;
  }
  configStr += '};\n';

  fs.writeFileSync(CONFIG_PATH, configStr);
  console.log('[prebuild-mobile] config.js updated at', CONFIG_PATH);
};

run();
