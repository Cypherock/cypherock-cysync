import { insertOrUpdateTransactions } from '@cypherock/coin-support-utils';
import { createLoggerWithPrefix, sleep } from '@cypherock/cysync-utils';
import { ITransaction } from '@cypherock/db-interfaces';

import { ISyncBtcAccountsParams } from './types';

import { getXpubDetails, mapBlockbookTxnToDb } from '../../services';
import baseLogger from '../../utils/logger';

const logger = createLoggerWithPrefix(baseLogger, 'syncAccount');
const PER_PAGE_TXN_LIMIT = 100;

export const syncAccount = async ({
  db,
  accountId,
  waitInMSBetweenEachAPICall,
}: ISyncBtcAccountsParams) => {
  const account = await db.account.getOne({ __id: accountId });

  if (!account) {
    logger.warn(`Account not found while syncing: ${accountId}`);
    return;
  }

  const afterBlock = undefined;

  let hasMore = false;
  let page = 1;

  const xpub = account.xpubOrAddress;
  const transactions: ITransaction[] = [];

  const updatedAccountInfo = {
    balance: account.balance,
    unconfirmedBalance: account.unconfirmedBalance,
  };

  do {
    const xpubDetails = await getXpubDetails({
      xpub,
      coinId: account.assetId,
      from: afterBlock,
      page,
      limit: PER_PAGE_TXN_LIMIT,
    });

    updatedAccountInfo.balance = xpubDetails.balance;
    updatedAccountInfo.unconfirmedBalance = xpubDetails.unconfirmedBalance;

    transactions.push(
      ...mapBlockbookTxnToDb(
        account,
        xpubDetails.transactions,
        xpubDetails.tokens,
      ),
    );

    hasMore = Boolean(
      xpubDetails.page &&
        xpubDetails.totalPages &&
        xpubDetails.totalPages > xpubDetails.page,
    );
    page = xpubDetails.page + 1;

    if (hasMore) {
      await sleep(waitInMSBetweenEachAPICall ?? 500);
    }
  } while (hasMore);

  await db.account.update({ __id: accountId }, updatedAccountInfo);
  await insertOrUpdateTransactions(db, transactions);
};
