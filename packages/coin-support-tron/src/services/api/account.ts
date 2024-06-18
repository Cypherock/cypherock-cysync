import { config } from '../../config';
import {
  TronAccountDetail,
  TronAccountDetailApiResponseSchema,
} from '../validators';

const baseURL = `${config.API_CYPHEROCK}`;

export const getAccountsDetailByAddress = async (
  address: string,
): Promise<Required<TronAccountDetail>> => {
  const url = `${baseURL}/address/${address}?page=1&pageSize=1&details=basic`;

  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      'api-key': config.NOW_NODES_API_KEY,
    },
  };

  const rawResult = await fetch(url, options).then(response => response.json());

  const result = TronAccountDetailApiResponseSchema.safeParse(rawResult);

  if (!result.success) throw new Error('Failed to fetch tron account details');

  return {
    nonTokenTxs: 0,
    ...result.data,
  };
};

export const getBalance = async (address: string): Promise<string> => {
  const accountDetails = await getAccountsDetailByAddress(address);
  return accountDetails.balance;
};
