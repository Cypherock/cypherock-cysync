import {
  TronIdMap,
  createTrc20AssetId,
  trc20JsonList,
  tronCoinList,
} from '@cypherock/coins';

import {
  CoingeckoPlatformMapping,
  TokenAutomationParams,
  TokenListItem,
} from '../../tokens';

const coingeckoPlatformMapping: CoingeckoPlatformMapping = {
  tron: TronIdMap.tron,
};

export const trc20TokenAutomationParams: TokenAutomationParams = {
  createTokenAssetId: createTrc20AssetId,
  tokenJsonList: trc20JsonList as TokenListItem[],
  coinList: tronCoinList,
  coinIdMap: TronIdMap,
  coingeckoPlatformMapping,
  filePrefix: 'trc20',
};
