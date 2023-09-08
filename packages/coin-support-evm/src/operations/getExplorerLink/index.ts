import { IGetExplorerLink } from '@cypherock/coin-support-interfaces';
import { evmCoinList } from '@cypherock/coins';

import { config } from '../../config';

export const getExplorerLink = (params: IGetExplorerLink) => {
  const queryParams = {
    network: evmCoinList[params.transaction.assetId].network,
    txHash: params.transaction.hash,
    isConfirmed: (params.transaction.confirmations ?? 0) > 0,
  };

  const query = new URLSearchParams('');
  for (const [key, value] of Object.entries(queryParams)) {
    query.append(key, value.toString());
  }

  return `${config.API_CYPHEROCK}/eth/transaction/open-txn?${query.toString()}`;
};
