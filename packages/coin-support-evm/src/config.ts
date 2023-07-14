// import { getEnvVariable } from '@cypherock/cysync-utils';

import { getEnvVariable } from '@cypherock/sdk-utils';

export const config = {
  API_CYPHEROCK: getEnvVariable('API_CYPHEROCK', 'https://api.cypherock.com'),
};
