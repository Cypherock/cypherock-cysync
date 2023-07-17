import { BtcSupport } from '@cypherock/coin-support-btc';
import { EvmSupport } from '@cypherock/coin-support-evm';
import { CoinSupport } from '@cypherock/coin-support-interfaces';
import { coinFamiliesMap, CoinFamily } from '@cypherock/coins';

const coinSupportMap: Record<CoinFamily, CoinSupport> = {
  [coinFamiliesMap.bitcoin]: new BtcSupport(),
  [coinFamiliesMap.evm]: new EvmSupport(),
  [coinFamiliesMap.near]: new EvmSupport(),
  [coinFamiliesMap.solana]: new EvmSupport(),
};

export const getCoinSupport = (coinFamily: string) => {
  const coinSupport: CoinSupport | undefined =
    coinSupportMap[coinFamily as CoinFamily];

  if (!coinSupport) {
    throw new Error(`No coin support exists for family ${coinFamily}`);
  }

  return coinSupport;
};
