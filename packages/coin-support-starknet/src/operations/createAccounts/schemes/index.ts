import { createDerivationPathGenerator } from '@cypherock/coin-support-utils';

import {
  StarknetDerivationSchemeMap,
  StarknetDerivationSchemeName,
  IStarknetDerivationScheme,
} from './types';

export const derivationPathSchemes: Record<
  StarknetDerivationSchemeName,
  IStarknetDerivationScheme
> = {
  [StarknetDerivationSchemeMap.ledger]: {
    name: StarknetDerivationSchemeMap.ledger,
    generator: createDerivationPathGenerator(
      "m/2645'/1195502025'/1148870696'/0'/0'/i",
    ),
    threshold: 2,
    newAccountLimit: 1,
  },
};
