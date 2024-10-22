import { createDerivationPathGenerator } from '@cypherock/coin-support-utils';

import {
  XrpDerivationSchemeMap,
  XrpDerivationSchemeName,
  IXrpDerivationScheme,
} from './types';

export const derivationPathSchemes: Record<
  XrpDerivationSchemeName,
  IXrpDerivationScheme
> = {
  [XrpDerivationSchemeMap.default]: {
    name: XrpDerivationSchemeMap.default,
    generator: createDerivationPathGenerator("m/44'/144'/0'/0/i"),
    threshold: 2,
    newAccountLimit: 1,
  },
};
