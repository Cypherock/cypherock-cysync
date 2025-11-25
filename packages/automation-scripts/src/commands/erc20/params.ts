import {
  EvmIdMap,
  createErc20AssetId,
  erc20JsonList,
  evmCoinList,
} from '@cypherock/coins';

import {
  CoingeckoPlatformMapping,
  TokenAutomationParams,
  TokenListItem,
} from '../../tokens';

const coingeckoPlatformMapping: CoingeckoPlatformMapping = {
  ethereum: EvmIdMap.ethereum,
  'binance-smart-chain': EvmIdMap.binance,
  avalanche: EvmIdMap.avalanche,
  'optimistic-ethereum': EvmIdMap.optimism,
  'polygon-pos': EvmIdMap.polygon,
  'arbitrum-one': EvmIdMap.arbitrum,
  fantom: EvmIdMap.fantom,
};

export const erc20TokenAutomationParams: TokenAutomationParams = {
  createTokenAssetId: createErc20AssetId,
  tokenJsonList: erc20JsonList as TokenListItem[],
  coinList: evmCoinList,
  coinIdMap: EvmIdMap,
  coingeckoPlatformMapping,
  filePrefix: 'erc20',
};
