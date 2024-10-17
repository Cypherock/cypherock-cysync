import { xrpCoinList } from '@cypherock/coins';
import { assert, makePostRequest } from '@cypherock/cysync-utils';

import { IXrpTransactionParams, IXrpTransactionResult } from './types';

import { config } from '../../config';

const baseURL = `${config.API_CYPHEROCK}/xrp/transaction`;

// Expire unconfirmed transactions after 70 ledger versions, approximately 1.5 minutes
const LEDGER_OFFSET = 70;

export const getTransactions = async (
  params: IXrpTransactionParams,
): Promise<IXrpTransactionResult> => {
  const url = `${baseURL}/history`;

  const query: Record<string, any> = {
    ...params,
    network: xrpCoinList[params.assetId].network,
  };
  delete query.assetId;

  const response = await makePostRequest(url, query);

  assert(
    typeof response.data.transactions === 'object',
    'Invalid transaction response from server',
  );

  return response.data;
};

export const getFees = async (assetId: string) => {
  const url = `${baseURL}/fees`;

  const query: Record<string, any> = {
    network: xrpCoinList[assetId].network,
  };

  const response = await makePostRequest(url, query);

  let fees = response.data?.fees?.minimum_fee ?? '10';

  if (typeof fees === 'number') fees = fees.toString();

  if (typeof fees !== 'string')
    throw new Error('Invalid xrp fees returned from server');

  return fees;
};

export const getLastLedgerSequence = async (assetId: string) => {
  const url = `${baseURL}/ledger-index`;

  const query: Record<string, any> = {
    network: xrpCoinList[assetId].network,
  };

  const response = await makePostRequest(url, query);

  const ledgerIndex = response.data?.ledger_index;

  if (ledgerIndex === undefined)
    throw new Error('Failed to fetch xrp ledger index from server');

  if (typeof ledgerIndex !== 'number')
    throw new Error('Invalid xrp ledger index returned from server');

  return ledgerIndex + LEDGER_OFFSET;
};

export const broadcastTransactionToBlockchain = async (
  transaction: string,
  assetId: string,
): Promise<any> => {
  const url = `${baseURL}/broadcast`;
  const response = await makePostRequest(
    url,
    {
      transaction,
      network: xrpCoinList[assetId].network,
    },
    {
      maxTries: 0,
    },
  );

  assert(
    !response.data.error,
    new Error('Server: Invalid txn hash from server'),
  );

  console.log({ TransactionBroadcastResult: response.data });

  return response.data;
};
