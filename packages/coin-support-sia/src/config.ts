import { getEnvVariable } from '@cypherock/cysync-utils';

export const config = {
  // API_CYPHEROCK: getEnvVariable('API_CYPHEROCK', 'http://localhost:5000'),
  API_CYPHEROCK: getEnvVariable('API_CYPHEROCK', 'https://api.cypherock.com'),
};
