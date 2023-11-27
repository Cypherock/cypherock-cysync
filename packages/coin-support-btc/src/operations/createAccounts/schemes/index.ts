import { createDerivationPathGenerator } from '@cypherock/coin-support-utils';
import { btcCoinList, BtcIdMap } from '@cypherock/coins';

import { BTCDerivationSchemeName, IBTCDerivationScheme } from './types';

export const createDerivationPathSchemes = (assetId: string) => {
  const coin = btcCoinList[assetId];
  const coinIndex = parseInt(coin.coinIndex, 10) - 80000000;

  const result: Record<
    BTCDerivationSchemeName,
    IBTCDerivationScheme | undefined
  > = {
    taproot: {
      name: 'taproot',
      generator: createDerivationPathGenerator(`m/86'/${coinIndex}'/i'`),
      threshold: 2,
      newAccountLimit: 1,
    },
    nativeSegwit: {
      name: 'nativeSegwit',
      generator: createDerivationPathGenerator(`m/84'/${coinIndex}'/i'`),
      threshold: 2,
      newAccountLimit: 1,
    },
    segwit: {
      name: 'segwit',
      generator: createDerivationPathGenerator(`m/49'/${coinIndex}'/i'`),
      threshold: 2,
      newAccountLimit: 1,
    },
    legacy: {
      name: 'legacy',
      generator: createDerivationPathGenerator(`m/44'/${coinIndex}'/i'`),
      threshold: 2,
      newAccountLimit: 1,
    },
  };

  // Only bitcoin has taproot, nativeSegwit, segwit
  if (coin.id !== BtcIdMap.bitcoin) {
    delete result.taproot;
    delete result.nativeSegwit;
    delete result.segwit;
  } else {
    // Not supported in firmware yet
    delete result.taproot;
    delete result.segwit;
  }

  return result;
};
