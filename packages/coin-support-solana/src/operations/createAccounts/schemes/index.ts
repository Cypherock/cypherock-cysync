import { createDerivationPathGenerator } from '@cypherock/coin-support-utils';

import { SolanaDerivationSchemeName, ISolanaDerivationScheme } from './types';

export const derivationPathSchemes: Record<
  SolanaDerivationSchemeName,
  ISolanaDerivationScheme
> = {
  paper: {
    name: 'paper',
    generator: createDerivationPathGenerator("m/44'/501'"),
    threshold: 2,
    newAccountLimit: 1,
  },
  ledger: {
    name: 'ledger',
    generator: createDerivationPathGenerator("m/44'/501'/i'"),
    threshold: 2,
    newAccountLimit: 1,
  },
  phantom: {
    name: 'phantom',
    generator: createDerivationPathGenerator("m/44'/501'/i'/0'"),
    threshold: 2,
    newAccountLimit: 1,
  },
};
