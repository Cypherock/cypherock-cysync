import { getEnvVariable } from '@cypherock/cysync-utils';

export const config = {
  API_CYPHEROCK: getEnvVariable('API_CYPHEROCK2', 'http://localhost:5000'),
};
