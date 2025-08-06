import { createDerivationPathGenerator } from '@cypherock/coin-support-utils';

import {
  StellarDerivationSchemeMap,
  StellarDerivationSchemeName,
  IStellarDerivationScheme,
} from './types';

export const derivationPathSchemes: Record<
  StellarDerivationSchemeName,
  IStellarDerivationScheme
> = {
  [StellarDerivationSchemeMap.default]: {
    name: StellarDerivationSchemeMap.default,
    generator: createDerivationPathGenerator("m/44'/148'/i'"),
    threshold: 2,
    newAccountLimit: 1,
  },
};
