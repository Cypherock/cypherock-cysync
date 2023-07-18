const config = {
  API_CYPHEROCK: 'https://dev-api.cypherock.com',
  ALLOW_PRERELEASE: true,
};

const updateProcessEnvWithConfig = () => {
  for (const key in config) {
    if (key in config) {
      process.env[key] = (config as any)[key];
    }
  }
};

updateProcessEnvWithConfig();

export default config;
