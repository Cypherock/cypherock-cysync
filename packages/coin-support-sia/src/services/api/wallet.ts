import { makePostRequest } from '@cypherock/cysync-utils';
import { ISiaUtxoResponse } from './types';
import { config } from '../../config';

// const baseURL = `http://localhost:5000/sia/wallet`;
const baseURL = `${config.API_CYPHEROCK}/sia/wallet`;

export const getBalance = async (address: string): Promise<string> => {
  const url = `${baseURL}/balance`;
  const response = await makePostRequest(url, { address });

  let balance = response.data?.balance ?? '0';

  if (typeof balance === 'number') balance = balance.toString();

  if (typeof balance !== 'string')
    throw new Error('Invalid sia balance returned from server');

  return balance;
};

export const getUtxos = async (address: string): Promise<ISiaUtxoResponse> => {
  const url = `${baseURL}/utxos`;
  const response = await makePostRequest(url, { address });

  if (typeof response.data.utxos !== 'object') {
    throw new Error('Invalid sia utxos returned from server');
  }

  return response.data;
};
