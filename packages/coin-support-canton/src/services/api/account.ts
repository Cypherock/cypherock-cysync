import { assert } from '@cypherock/cysync-utils';
import { IKeyValueStore } from '@cypherock/db-interfaces';

import { makePostRequestWithAuthTokenConfig } from './common';
import { ICantonInstrument } from './types';

import { config } from '../../config';

const baseURL = `${config.API_CYPHEROCK}/canton/wallet`;

export const getBalance = async (
  partyId: string,
  instrument: ICantonInstrument,
  keyDB?: IKeyValueStore,
): Promise<string> => {
  const url = `${baseURL}/balance`;
  const data = {
    partyId,
    instrument,
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
  const url = `${baseURL}/is-account-created`;
  const data = {
    partyId,
  };

  const response = await makePostRequestWithAuthTokenConfig(url, data, keyDB);
  return response.data?.isCreated ?? false;
};

export const isTransferPreApprovalEnabled = async (
  partyId: string,
  instrument: ICantonInstrument,
  keyDB?: IKeyValueStore,
): Promise<boolean> => {
  const url = `${baseURL}/transfer-preapproval-status`;
  const data = {
    partyId,
    instrument,
  };
  const response = await makePostRequestWithAuthTokenConfig(url, data, keyDB);

  return (
    response.data?.receiverId === partyId &&
    new Date(response.data.expiresAt) > new Date(Date.now())
  );
};

export const getUtxos = async (
  partyId: string,
  instrument: ICantonInstrument,
  keyDB?: IKeyValueStore,
): Promise<any[]> => {
  const url = `${baseURL}/utxos`;
  const data = {
    partyId,
    instrument,
  };

  const response = await makePostRequestWithAuthTokenConfig(url, data, keyDB);

  assert(
    typeof response.data?.utxos === 'object',
    'Invalid utxos response from server',
  );

  return response.data.utxos;
};

export const doesPartyExist = async (
  partyId: string,
  keyDB?: IKeyValueStore,
): Promise<boolean> => {
  const url = `${baseURL}/does-party-exist`;
  const data = {
    partyId,
  };
  const response = await makePostRequestWithAuthTokenConfig(url, data, keyDB);
  return response.data?.exists ?? false;
};
