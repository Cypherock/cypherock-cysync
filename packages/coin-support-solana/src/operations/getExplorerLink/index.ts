import { IGetExplorerLink } from '@cypherock/coin-support-interfaces';
import { solanaCoinList } from '@cypherock/coins';

import { config } from '../../config';

export const getExplorerLink = (params: IGetExplorerLink) => {
  const queryParams = {
    network: solanaCoinList[params.transaction.assetId].network,
    txHash: params.transaction.hash,
  };

  const query = new URLSearchParams('');
  for (const [key, value] of Object.entries(queryParams)) {
    query.append(key, value.toString());
  }

  return `${
    config.API_CYPHEROCK
  }/solana/transaction/open-txn?${query.toString()}`;
};
