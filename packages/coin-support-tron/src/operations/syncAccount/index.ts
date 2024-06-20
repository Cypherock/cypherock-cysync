import {
  IGetAddressDetails,
  createSyncAccountsObservable,
} from '@cypherock/coin-support-utils';

import { ISyncTronAccountsParams } from './types';

import { getBalance } from '../../services';

const getAddressDetails: IGetAddressDetails<any> = async ({ account }) => {
  const updatedBalance = await getBalance(
    account.xpubOrAddress,
    account.parentAssetId,
  );

  const updatedAccountInfo = {
    balance: updatedBalance,
    extraData: { ...(account.extraData ?? {}) },
  };

  return {
    hasMore: false,
    transactions: [],
    updatedAccountInfo,
    nextIterationContext: {},
  };
};

export const syncAccount = (params: ISyncTronAccountsParams) =>
  createSyncAccountsObservable({
    ...params,
    getAddressDetails,
  });
