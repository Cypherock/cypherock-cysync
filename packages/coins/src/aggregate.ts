import { btcCoinList, BtcIds } from './btc';
import { evmCoinList, EvmIds } from './evm';
import { nearCoinList, NearIds } from './near';
import { solanaCoinList, SolanaIds } from './solana';
import { ICoinInfo } from './types';

export const coinList: Record<
  BtcIds | EvmIds | SolanaIds | NearIds,
  ICoinInfo
> = {
  ...btcCoinList,
  ...evmCoinList,
  ...nearCoinList,
  ...solanaCoinList,
};
