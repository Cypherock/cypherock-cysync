import { IGetExplorerLink } from '@cypherock/coin-support-interfaces';
import { btcCoinList } from '@cypherock/coins';

import { config } from '../../config';

export const getExplorerLink = (params: IGetExplorerLink) => {
  const queryParams = {
    coinType: btcCoinList[params.transaction.assetId].apiCoinType,
    txHash: params.transaction.hash,
    isConfirmed: (params.transaction.confirmations ?? 0) > 0,
  };

  const query = new URLSearchParams('');
  for (const [key, value] of Object.entries(queryParams)) {
    query.append(key, value.toString());
  }

  return `${config.API_CYPHEROCK}/transaction/open-txn?${query.toString()}`;
};
