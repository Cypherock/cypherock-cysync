import { btcCoinList, BtcId } from './btc';
import { cantonCoinList, CantonId, ICantonToken } from './canton';
import { evmCoinList, EvmId, IEvmErc20Token } from './evm';
import { icpCoinList, IcpId, IIcpIcrcToken } from './icp';
import { nearCoinList, NearId } from './near';
import { solanaCoinList, SolanaId } from './solana';
import { starknetCoinList, StarknetId } from './starknet';
import { stellarCoinList, StellarId } from './stellar';
import { tronCoinList, ITronTrc20Token } from './tron';
import { ICoinInfo } from './types';
import { xrpCoinList, XrpId } from './xrp';

export const coinList: Record<
  | BtcId
  | EvmId
  | SolanaId
  | NearId
  | XrpId
  | StarknetId
  | IcpId
  | StellarId
  | CantonId,
  ICoinInfo
> = {
  ...btcCoinList,
  ...evmCoinList,
  ...nearCoinList,
  ...solanaCoinList,
  ...tronCoinList,
  ...xrpCoinList,
  ...starknetCoinList,
  ...icpCoinList,
  ...stellarCoinList,
  ...cantonCoinList,
};

export type CoinTypes =
  | BtcId
  | EvmId
  | SolanaId
  | NearId
  | XrpId
  | StarknetId
  | IcpId
  | StellarId
  | CantonId;
export type TokenTypes =
  | IEvmErc20Token
  | ITronTrc20Token
  | IIcpIcrcToken
  | ICantonToken;
