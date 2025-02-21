import { createDerivationPathGenerator } from '@cypherock/coin-support-utils';

import {
  IcpDerivationSchemeMap,
  IcpDerivationSchemeName,
  IIcpDerivationScheme,
} from './types';

export const derivationPathSchemes: Record<
  IcpDerivationSchemeName,
  IIcpDerivationScheme
> = {
  [IcpDerivationSchemeMap.default]: {
    name: IcpDerivationSchemeMap.default,
    generator: createDerivationPathGenerator("m/44'/223'/0'/0/i"),
    threshold: 2,
    newAccountLimit: 1,
  },
};
