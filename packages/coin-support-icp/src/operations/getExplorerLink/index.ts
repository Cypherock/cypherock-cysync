import { IGetExplorerLink } from '@cypherock/coin-support-interfaces';
import { icpCoinList } from '@cypherock/coins';
import { assert } from '@cypherock/cysync-utils';

const BASE_DASHBOARD_URL = 'https://dashboard.internetcomputer.org';

export const getExplorerLink = (params: IGetExplorerLink) => {
  const { transaction } = params;
  const { assetId, parentAssetId } = transaction;

  const coin = icpCoinList[assetId] ?? icpCoinList[parentAssetId];

  assert(coin, new Error('No coin found'));

  let explorerLink = `${BASE_DASHBOARD_URL}/transaction/${transaction.hash}`;

  if (assetId && parentAssetId && assetId !== parentAssetId) {
    const token = coin.tokens[assetId];
    assert(
      token,
      new Error(`No token found for coin ${parentAssetId}:${assetId}`),
    );

    explorerLink = `${BASE_DASHBOARD_URL}/${token.dashboardRoute}/transaction/${transaction.hash}`;
  }

  return explorerLink;
};
