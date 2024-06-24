import { makePostRequest } from '@cypherock/cysync-utils';

import { config } from '../../config';
import {
  TronAccountDetail,
  TronAccountDetailApiResponseSchema,
} from '../validators';

const baseURL = `${config.API_CYPHEROCK}/tron/wallet`;

export const getAccountsDetailByAddress = async (
  address: string,
): Promise<Required<TronAccountDetail>> => {
  const url = `${baseURL}/address`;

  const response = await makePostRequest(url, { address });

  const result = TronAccountDetailApiResponseSchema.safeParse(response.data);

  if (!result.success) throw new Error('Failed to fetch tron account details');

  return {
    details: {},
    nonTokenTxs: 0,
    ...result.data,
  };
};

export const getBalanceAndTransactionsCount = async (
  address: string,
): Promise<{ balance: string; txnCount: number }> => {
  const accountDetails = await getAccountsDetailByAddress(address);
  return {
    balance: accountDetails.balance,
    txnCount: accountDetails.txs,
  };
};
