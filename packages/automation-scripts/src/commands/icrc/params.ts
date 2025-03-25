import {
  IcpIdMap,
  createIcrcAssetId,
  icrcJsonList,
  icpCoinList,
} from '@cypherock/coins';

import {
  CoingeckoPlatformMapping,
  TokenAutomationParams,
  TokenListItem,
} from '../../tokens';

const coingeckoPlatformMapping: CoingeckoPlatformMapping = {
  'internet-computer': IcpIdMap.icp,
};

export const icrcTokenAutomationParams: TokenAutomationParams = {
  createTokenAssetId: createIcrcAssetId,
  tokenJsonList: icrcJsonList as TokenListItem[],
  coinList: icpCoinList,
  coinIdMap: IcpIdMap,
  coingeckoPlatformMapping,
  filePrefix: 'icrc',
};
