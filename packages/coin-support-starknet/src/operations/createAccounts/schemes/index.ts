import { createDerivationPathGenerator } from '@cypherock/coin-support-utils';

import {
  StarknetDerivationSchemeName,
  IStarknetDerivationScheme,
} from './types';

export const derivationPathSchemes: Record<
  StarknetDerivationSchemeName,
  IStarknetDerivationScheme
> = {
  default: {
    name: 'default',
    generator: createDerivationPathGenerator("m/44'/9004'/0'/0/i"),
    threshold: 2,
    newAccountLimit: 1,
  },
};
