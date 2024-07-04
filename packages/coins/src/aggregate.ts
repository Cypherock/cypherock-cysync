import { btcCoinList, BtcId } from './btc';
import { evmCoinList, EvmId, IEvmErc20Token } from './evm';
import { nearCoinList, NearId } from './near';
import { solanaCoinList, SolanaId } from './solana';
import { tronCoinList, ITronTrc20Token } from './tron';
import { ICoinInfo } from './types';

export const coinList: Record<BtcId | EvmId | SolanaId | NearId, ICoinInfo> = {
  ...btcCoinList,
  ...evmCoinList,
  ...nearCoinList,
  ...solanaCoinList,
  ...tronCoinList,
};

export type CoinTypes = BtcId | EvmId | SolanaId | NearId;
export type TokenTypes = IEvmErc20Token | ITronTrc20Token;
