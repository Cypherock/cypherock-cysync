import { BtcSupport } from '@cypherock/coin-support-btc';
import { EvmSupport } from '@cypherock/coin-support-evm';
import { CoinSupport } from '@cypherock/coin-support-interfaces';
import { NearSupport } from '@cypherock/coin-support-near';
import { SolanaSupport } from '@cypherock/coin-support-solana';
import { coinFamiliesMap, CoinFamily } from '@cypherock/coins';

const coinSupportMap: Record<CoinFamily, CoinSupport> = {
  [coinFamiliesMap.bitcoin]: new BtcSupport(),
  [coinFamiliesMap.evm]: new EvmSupport(),
  [coinFamiliesMap.near]: new NearSupport(),
  [coinFamiliesMap.solana]: new SolanaSupport(),
};

export const getCoinSupport = (coinFamily: string) => {
  const coinSupport: CoinSupport | undefined =
    coinSupportMap[coinFamily as CoinFamily];

  if (!coinSupport) {
    throw new Error(`No coin support exists for family ${coinFamily}`);
  }

  return coinSupport;
};
