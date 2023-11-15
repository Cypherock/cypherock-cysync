import { createDerivationPathGenerator } from '@cypherock/coin-support-utils';

import { EvmDerivationSchemeName, IEvmDerivationScheme } from './types';

export const derivationPathSchemes: Record<
  EvmDerivationSchemeName,
  IEvmDerivationScheme
> = {
  ledger: {
    name: 'ledger',
    generator: createDerivationPathGenerator("m/44'/60'/i'/0/0"),
    threshold: 2,
    newAccountLimit: 1,
  },
  metamask: {
    name: 'metamask',
    generator: createDerivationPathGenerator("m/44'/60'/0'/0/i"),
    threshold: 2,
    newAccountLimit: 1,
  },
  legacy: {
    name: 'legacy',
    generator: createDerivationPathGenerator("m/44'/60'/0'/i"),
    threshold: 2,
    newAccountLimit: 1,
  },
};
