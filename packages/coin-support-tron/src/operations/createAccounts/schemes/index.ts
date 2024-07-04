import { createDerivationPathGenerator } from '@cypherock/coin-support-utils';

import { TronDerivationSchemeName, ITronDerivationScheme } from './types';

export const derivationPathSchemes: Record<
  TronDerivationSchemeName,
  ITronDerivationScheme
> = {
  tronlink: {
    name: 'tronlink',
    generator: createDerivationPathGenerator("m/44'/195'/0'/0/i"),
    threshold: 2,
    newAccountLimit: 1,
  },
  atomic: {
    name: 'atomic',
    generator: createDerivationPathGenerator("m/44'/195'/0'"),
    threshold: 2,
    newAccountLimit: 1,
  },
};
