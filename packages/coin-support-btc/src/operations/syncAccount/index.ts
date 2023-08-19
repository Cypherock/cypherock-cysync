import {
  IGetAddressDetails,
  createSyncAccountsObservable,
  getLatestTransactionBlock,
} from '@cypherock/coin-support-utils';

import { ISyncBtcAccountsParams } from './types';

import {
  getDerivedAddresses,
  getXpubDetails,
  IDerivedAddresses,
  mapBlockbookTxnToDb,
} from '../../services';

const PER_PAGE_TXN_LIMIT = 100;

const getAddressDetails: IGetAddressDetails<{
  page: number;
  afterBlock?: number;
  derivedAddresses: IDerivedAddresses;
}> = async ({ db, account, iterationContext }) => {
  const afterBlock =
    iterationContext?.afterBlock ??
    (await getLatestTransactionBlock(db, {
      accountId: account.__id,
    }));

  const derivedAddresses =
    iterationContext?.derivedAddresses ??
    (await getDerivedAddresses({
      xpub: account.xpubOrAddress,
      coinId: account.assetId,
    }));

  let hasMore = false;
  let page = iterationContext?.page ?? 1;

  const xpub = account.xpubOrAddress;

  const updatedAccountInfo = {
    balance: account.balance,
    extraData: {
      ...(account.extraData ?? {}),
    },
  };

  const xpubDetails = await getXpubDetails({
    xpub,
    coinId: account.assetId,
    from: afterBlock,
    page,
    limit: PER_PAGE_TXN_LIMIT,
  });

  updatedAccountInfo.balance = xpubDetails.balance;
  updatedAccountInfo.extraData.unconfirmedBalance =
    xpubDetails.unconfirmedBalance;

  const transactions = mapBlockbookTxnToDb(
    account,
    xpubDetails.transactions,
    derivedAddresses.tokens.map(e => e.name.toLowerCase()),
  );

  hasMore = Boolean(
    xpubDetails.page &&
      xpubDetails.totalPages &&
      xpubDetails.totalPages > xpubDetails.page,
  );
  page = xpubDetails.page + 1;

  return {
    hasMore,
    transactions,
    updatedAccountInfo,
    nextIterationContext: { page, afterBlock, derivedAddresses },
  };
};

export const syncAccount = (params: ISyncBtcAccountsParams) =>
  createSyncAccountsObservable({
    ...params,
    getAddressDetails,
  });
