import { IBtcCoinInfo } from '@cypherock/coins';

import { config } from '../config';

const baseURL = `${config.API_CYPHEROCK}/transaction`;

export const getTransactionLink = (
  coin: IBtcCoinInfo,
  transactionHash: string,
  isConfirmed: boolean,
) =>
  `${baseURL}/open-txn?coinType=${coin.apiCoinType}&txHash=${transactionHash}&isConfirmed=${isConfirmed}`;
