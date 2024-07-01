import { IGetExplorerLink } from '@cypherock/coin-support-interfaces';

import { config } from '../../config';

export const getExplorerLink = (params: IGetExplorerLink) => {
  // always assume confirmed transaction state so that API can re-direct to the transaction link
  const queryParams = {
    txHash: params.transaction.hash,
    isConfirmed: true,
  };

  const query = new URLSearchParams('');
  for (const [key, value] of Object.entries(queryParams)) {
    query.append(key, value.toString());
  }

  return `${
    config.API_CYPHEROCK
  }/tron/transaction/open-txn?${query.toString()}`;
};
