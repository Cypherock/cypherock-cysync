import { getEnvVariable } from '@cypherock/cysync-utils';

export const config = {
  API_CYPHEROCK: getEnvVariable('API_CYPHEROCK', 'https://api.cypherock.com'),
  NOW_NODES_API_KEY: getEnvVariable('NOW_NODES_API_KEY', 'TEST'),
};
