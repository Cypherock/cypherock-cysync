import { createDerivationPathGenerator } from '@cypherock/coin-support-utils';

import {
  SiaDerivationSchemeMap,
  SiaDerivationSchemeName,
  ISiaDerivationScheme,
} from './types';

export const derivationPathSchemes: Record<
  SiaDerivationSchemeName,
  ISiaDerivationScheme
> = {
  [SiaDerivationSchemeMap.default]: {
    name: SiaDerivationSchemeMap.default,
    generator: createDerivationPathGenerator('m/i'),
    threshold: 2,
    newAccountLimit: 1,
  },
};
