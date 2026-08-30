import {
  XrpIdMap,
  createXrpAssetId,
  xrpJsonList,
  xrpCoinList,
} from '@cypherock/coins';

import {
  CoingeckoPlatformMapping,
  TokenAutomationParams,
  TokenListItem,
} from '../../tokens';

const coingeckoPlatformMapping: CoingeckoPlatformMapping = {
  xrp: XrpIdMap.xrp,
};

export const xrpTokenAutomationParams: TokenAutomationParams = {
  createTokenAssetId: createXrpAssetId,
  tokenJsonList: xrpJsonList as TokenListItem[],
  coinList: xrpCoinList,
  coinIdMap: XrpIdMap,
  coingeckoPlatformMapping,
  filePrefix: 'xrp',
};
