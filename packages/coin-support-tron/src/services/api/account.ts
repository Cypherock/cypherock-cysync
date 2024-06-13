import { config } from '../../config';
import {
  TronAccountDetail,
  TronAccountDetailsApiResponseSchema,
} from '../validators';

const baseURL = `${config.API_CYPHEROCK}`;

export const getAccountsDetailByAddress = async (
  address: string,
): Promise<TronAccountDetail[]> => {
  const url = `${baseURL}/accounts/${address}`;

  const options = { method: 'GET', headers: { accept: 'application/json' } };

  const rawResult = await fetch(url, options).then(response => response.json());

  const result = TronAccountDetailsApiResponseSchema.safeParse(rawResult);

  if (!result.success) throw new Error('Failed to fetch tron account details');

  if (!result.data.success) {
    throw new Error(result.data.error);
  }

  return result.data.data;
};

export const getBalance = async (address: string): Promise<string> => {
  const accountDetails = await getAccountsDetailByAddress(address);
  let balance = 0;
  accountDetails.forEach(accountDetail => {
    balance += accountDetail.balance;
  });
  return balance.toString(10);
};
