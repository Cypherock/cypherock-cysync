import {
  SolanaIdMap,
  createSplAssetId,
  splJsonList,
  solanaCoinList,
} from '@cypherock/coins';

import {
  CoingeckoPlatformMapping,
  TokenAutomationParams,
  TokenListItem,
} from '../../tokens';

const coingeckoPlatformMapping: CoingeckoPlatformMapping = {
  solana: SolanaIdMap.solana,
};

export const splTokenAutomationParams: TokenAutomationParams = {
  createTokenAssetId: createSplAssetId,
  tokenJsonList: splJsonList as TokenListItem[],
  coinList: solanaCoinList,
  coinIdMap: SolanaIdMap,
  coingeckoPlatformMapping,
  filePrefix: 'spl',
};
