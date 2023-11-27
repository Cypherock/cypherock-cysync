import { createDerivationPathGenerator } from '@cypherock/coin-support-utils';

import { NearDerivationSchemeName, INearDerivationScheme } from './types';

export const derivationPathSchemes: Record<
  NearDerivationSchemeName,
  INearDerivationScheme
> = {
  default: {
    name: 'default',
    generator: createDerivationPathGenerator("m/44'/397'/0'/0'/i'"),
    threshold: 2,
    newAccountLimit: 1,
  },
};
