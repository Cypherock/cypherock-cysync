import { btcCoinList, BtcId } from './btc';
import { evmCoinList, EvmId } from './evm';
import { nearCoinList, NearId } from './near';
import { solanaCoinList, SolanaId } from './solana';
import { tronCoinList } from './tron';
import { ICoinInfo } from './types';

export const coinList: Record<BtcId | EvmId | SolanaId | NearId, ICoinInfo> = {
  ...btcCoinList,
  ...evmCoinList,
  ...nearCoinList,
  ...solanaCoinList,
  ...tronCoinList,
};

export type CoinTypes = BtcId | EvmId | SolanaId | NearId;
