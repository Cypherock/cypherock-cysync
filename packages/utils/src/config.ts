import { getEnvVariable } from './getEnv';

export const config = {
  LOG_LEVEL: getEnvVariable('LOG_LEVEL', 'debug'),
};
