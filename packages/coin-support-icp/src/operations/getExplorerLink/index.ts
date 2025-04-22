import { IGetExplorerLink } from '@cypherock/coin-support-interfaces';
import { icpCoinList } from '@cypherock/coins';
import { assert } from '@cypherock/cysync-utils';

import { config } from '../../config';

export const getExplorerLink = (params: IGetExplorerLink) => {
  const { transaction } = params;
  const { assetId, parentAssetId, hash } = transaction;

  const queryParams: { txHash: string; dashboardRoute?: string } = {
    txHash: hash,
  };

  const coin = icpCoinList[assetId] ?? icpCoinList[parentAssetId];

  assert(coin, new Error('No coin found'));

  if (assetId && parentAssetId && assetId !== parentAssetId) {
    const token = coin.tokens[assetId];
    assert(
      token,
      new Error(`No token found for coin ${parentAssetId}:${assetId}`),
    );

    queryParams.dashboardRoute = token.dashboardRoute;
  }

  const query = new URLSearchParams('');
  for (const [key, value] of Object.entries(queryParams)) {
    query.append(key, value.toString());
  }

  return `${config.API_CYPHEROCK}/icp/transaction/open-txn?${query.toString()}`;
};
