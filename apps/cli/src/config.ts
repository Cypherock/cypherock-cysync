import dotEnv from 'dotenv-flow';

const config = {
  API_CYPHEROCK: 'https://dev-api.cypherock.com',
  ALLOW_PRERELEASE: true,
  LOG_LEVEL: 'error',
};

dotEnv.config();
const updateProcessEnvWithConfig = () => {
  for (const key in config) {
    if (key in config) {
      if (!process.env[key]) {
        process.env[key] = (config as any)[key];
      }
    }
  }
};

updateProcessEnvWithConfig();

export default config;
