import { createDerivationPathGenerator } from '@cypherock/coin-support-utils';

import { XrpDerivationSchemeName, IXrpDerivationScheme } from './types';

export const derivationPathSchemes: Record<
  XrpDerivationSchemeName,
  IXrpDerivationScheme
> = {
  default: {
    name: 'default',
    generator: createDerivationPathGenerator("m/44'/144'/0'/0/i"),
    threshold: 2,
    newAccountLimit: 1,
  },
};
