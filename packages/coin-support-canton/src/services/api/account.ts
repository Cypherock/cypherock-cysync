import { assert } from '@cypherock/cysync-utils';
import { IKeyValueStore } from '@cypherock/db-interfaces';

import { makePostRequestWithAuthTokenConfig } from './common';

import { config } from '../../config';

const baseURL = `${config.API_CYPHEROCK}/canton/wallet`;

export const getBalance = async (
  partyId: string,
  keyDB?: IKeyValueStore,
): Promise<string> => {
  const url = `${baseURL}/balance`;
  const data = {
    partyId,
  };
  const response = await makePostRequestWithAuthTokenConfig(url, data, keyDB);

  let balance = response.data?.balance ?? '0';

  if (typeof balance === 'number') balance = balance.toString();

  if (typeof balance !== 'string')
    throw new Error('Invalid canton balance returned from server');

  return balance;
};

export const getIsAccountCreated = async (
  partyId: string,
  keyDB?: IKeyValueStore,
): Promise<boolean> => {
  try {
    const url = `${baseURL}/balance`;
    const data = {
      partyId,
    };
    const response = await makePostRequestWithAuthTokenConfig(url, data, keyDB);

    if (!response.data?.balance) return false;
    return true;
  } catch (error) {
    return false;
  }
};

export const isTransferPreApprovalEnabled = async (
  partyId: string,
  keyDB?: IKeyValueStore,
): Promise<boolean> => {
  const url = `${baseURL}/transfer-preapproval-status`;
  const data = {
    partyId,
  };
  const response = await makePostRequestWithAuthTokenConfig(url, data, keyDB);

  return (
    response.data?.receiverId === partyId &&
    new Date(response.data.expiresAt) > new Date(Date.now())
  );
};

export const getUtxos = async (
  partyId: string,
  keyDB?: IKeyValueStore,
): Promise<any[]> => {
  const url = `${baseURL}/utxos`;
  const data = {
    partyId,
  };

  const response = await makePostRequestWithAuthTokenConfig(url, data, keyDB);

  assert(
    typeof response.data?.utxos === 'object',
    'Invalid utxos response from server',
  );

  return response.data.utxos;
};
