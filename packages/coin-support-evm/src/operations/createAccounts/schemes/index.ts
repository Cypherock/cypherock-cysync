import { createDerivationPathGenerator } from '@cypherock/coin-support-utils';

import { EVMDerivationSchemeName, IEVMDerivationScheme } from './types';

export const derivationPathSchemes: Record<
  EVMDerivationSchemeName,
  IEVMDerivationScheme
> = {
  ledger: {
    name: 'ledger',
    generator: createDerivationPathGenerator("m/44'/60'/i'/0/0"),
    threshold: 2,
  },
  metamask: {
    name: 'metamask',
    generator: createDerivationPathGenerator("m/44'/60'/0'/0/i"),
    threshold: 2,
  },
  legacy: {
    name: 'legacy',
    generator: createDerivationPathGenerator("m/44'/60'/0'/i"),
    threshold: 2,
  },
};
