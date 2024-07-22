import { IGetExplorerLink } from '@cypherock/coin-support-interfaces';
import { nearCoinList } from '@cypherock/coins';

import { config } from '../../config';

export const getExplorerLink = (params: IGetExplorerLink) => {
  const queryParams = {
    network: nearCoinList[params.transaction.assetId].network,
    txHash: params.transaction.hash,
  };

  const query = new URLSearchParams('');
  for (const [key, value] of Object.entries(queryParams)) {
    query.append(key, value.toString());
  }

  return `${
    config.API_CYPHEROCK
  }/near/transaction/open-txn?${query.toString()}`;
};
