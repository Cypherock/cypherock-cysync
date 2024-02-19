import { getEnvVariable } from '@cypherock/cysync-utils';

export const config = {
  API_CYPHEROCK: getEnvVariable('API_CYPHEROCK', 'https://api.cypherock.com'),
  INFURA_STARKNET_API_KEY: getEnvVariable('INFURA_STARKNET_API_KEY', ''),
};
