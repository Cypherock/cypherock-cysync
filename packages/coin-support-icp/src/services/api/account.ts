import { makePostRequest } from '@cypherock/cysync-utils';

import { config } from '../../config';
import { ICP_LEDGER_CANISTER_ID } from '../../constants';

const baseURL = `${config.API_CYPHEROCK}/icp/wallet`;

export const getBalance = async (accountId: string) => {
  const url = `${baseURL}/balance`;
  const response = await makePostRequest(url, {
    accountId,
    canisterId: ICP_LEDGER_CANISTER_ID,
  });

  let balance = response.data?.balance ?? '0';

  if (typeof balance === 'number') balance = balance.toString();

  if (typeof balance !== 'string')
    throw new Error('Invalid icp balance returned from server');

  return balance;
};

export const getTokenBalance = async (
  principalId: string,
  tokenLedgerCanisterId: string,
) => {
  const url = `${baseURL}/token/balance`;
  const response = await makePostRequest(url, {
    principalId,
    canisterId: tokenLedgerCanisterId,
  });

  let balance = response.data?.balance ?? '0';

  if (typeof balance === 'number') balance = balance.toString();

  if (typeof balance !== 'string')
    throw new Error('Invalid icp token balance returned from server');

  return balance;
};
