import { IGetExplorerLink } from '@cypherock/coin-support-interfaces';
import { btcCoinList } from '@cypherock/coins';

import { config } from '../../config';

export const getExplorerLink = (params: IGetExplorerLink) => {
  // always assume confirmed transaction state so that API can re-direct to the transaction link
  const queryParams = {
    coinType: btcCoinList[params.transaction.assetId].apiCoinType,
    txHash: params.transaction.hash,
    isConfirmed: true,
  };

  const query = new URLSearchParams('');
  for (const [key, value] of Object.entries(queryParams)) {
    query.append(key, value.toString());
  }

  return `${config.API_CYPHEROCK}/transaction/open-txn?${query.toString()}`;
};
