import { assert } from '@cypherock/cysync-utils';
import { TokenAutomationParams } from './types';

export const assertTokenAutomationParams = (params: TokenAutomationParams) => {
  assert(params, 'Token automation params are not provided');
  assert(params.createTokenAssetId, 'createTokenAssetId is not provided');
  assert(params.tokenJsonList, 'tokenJsonList is not provided');
  assert(params.coinList, 'coinList is not provided');
  assert(params.coinIdMap, 'coinIdMap is not provided');
  assert(
    params.coingeckoPlatformMapping,
    'coingeckoPlatformMapping is not provided',
  );
  assert(params.filePrefix, 'filePrefix is not provided');
};
