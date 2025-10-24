import { makePostRequest } from '@cypherock/cysync-utils';
import {
  ISiaHistoryResponse,
  IBroadcastRequest,
  ISiaBroadcastResponse,
  ISiaOutput,
} from './types';
import { config } from '../../config';

// const baseURL = `http://localhost:5000/sia/transaction`;
const baseURL = `${config.API_CYPHEROCK}/sia/transaction`;

export const getTransactions = async (
  address: string,
): Promise<ISiaHistoryResponse> => {
  const url = `${baseURL}/history`;
  const response = await makePostRequest(url, { address });

  if (typeof response.data.transactions !== 'object') {
    throw new Error('Invalid sia transaction history returned from server');
  }

  return response.data;
};

export const getFees = async (): Promise<{
  baseFee: string;
  recommendedFee: string;
}> => {
  const url = `${baseURL}/fees`;
  const response = await makePostRequest(url, {});

  const { baseFee, recommendedFee } = response.data ?? {};

  if (typeof baseFee !== 'string' || typeof recommendedFee !== 'string') {
    throw new Error(
      'Invalid response: expected baseFee and recommendedFee as strings',
    );
  }

  return { baseFee, recommendedFee };
};

export const broadcastBlockchainTransaction = async (
  selectedUtxos: string[],
  outputs: ISiaOutput[],
  fee: string,
  signature: string,
  publicKey: string,
  fromAddress: string,
): Promise<ISiaBroadcastResponse> => {
  const url = `${baseURL}/broadcast`;
  const broadcastRequest: IBroadcastRequest = {
    selectedUtxos,
    outputs,
    fee,
    signature,
    publicKey,
    fromAddress,
  };
  const response = await makePostRequest(url, broadcastRequest, {
    maxTries: 0,
  });

  if (response.data.success === undefined) {
    throw new Error('Invalid sia broadcast response from server');
  }

  return response.data;
};
