import { ISignedTransaction } from '@cypherock/sdk-app-tron';
import { makePostRequest, BigNumber } from '@cypherock/cysync-utils';
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

export const getBalanceAndTransactionsCount = async (
  address: string,
): Promise<{ balance: string; txnCount: number }> => {
  const accountDetails = await getAccountsDetailByAddress(address);
  return {
    balance: accountDetails.balance,
    txnCount: accountDetails.txs,
  };
};

export const broadcastTransactionToBlockchain = async (
  transaction: ISignedTransaction,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _assetId: string,
): Promise<string> => {
  const url = `https://api.trongrid.io/wallet/broadcasttransaction`;
  await makePostRequest(url, transaction);

  return transaction.txID;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const getAverageEnergyPrice = async (_assetId: string) => {
  const url = `https://api.trongrid.io/jsonrpc`;
  const response = await makePostRequest(url, {
    jsonrpc: '2.0',
    id: 1,
    method: 'eth_gasPrice',
    params: [],
  });

  const fees = response.data?.result;
  return new BigNumber(fees).toString(10);
};

export const getAccountResources = async (
  address: string,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _assetId: string,
): Promise<{
  freeNetUsed?: number;
  freeNetLimit?: number;
  NetUsed?: number;
  NetLimit?: number;
  TotalNetLimit?: number;
  TotalNetWeight?: number;
  totalTronPowerWeight?: number;
  tronPowerLimit?: number;
  tronPowerUsed?: number;
  EnergyUsed?: number;
  EnergyLimit?: number;
  TotalEnergyLimit?: number;
  TotalEnergyWeight?: number;
  assetNetUsed?: number;
  assetNetLimit?: number;
}> => {
  const url = `https://api.trongrid.io/wallet/getaccountresource`;
  const response = await makePostRequest(url, {
    address,
    visible: true,
  });

  return response.data;
};
