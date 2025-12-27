import { createDerivationPathGenerator } from '@cypherock/coin-support-utils';

import {
  CantonDerivationSchemeMap,
  CantonDerivationSchemeName,
  ICantonDerivationScheme,
} from './types';

export const derivationPathSchemes: Record<
  CantonDerivationSchemeName,
  ICantonDerivationScheme
> = {
  [CantonDerivationSchemeMap.default]: {
    name: CantonDerivationSchemeMap.default,
    generator: createDerivationPathGenerator("m/44'/6767'/0'/0'/i'"),
    threshold: 1,
    newAccountLimit: 1,
  },
};
