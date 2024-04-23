import {
  AccountTypeMap,
  ITransaction,
  ITransactionNotificationClick,
  ITransactionNotificationRead,
  TransactionTypeMap,
} from '@cypherock/db-interfaces';
import { createAsyncThunk } from '@reduxjs/toolkit';
import lodash from 'lodash';

import { RootState, setTransactionNotifications } from '~/store';
import { getDB } from '~/utils';

export const markAllTransactionNotificationRead = async (
  transactions: ITransaction[],
) => {
  for (const txn of transactions) {
    markTransactionNotificationRead(txn);
  }
};

export const markTransactionNotificationRead = async (t: ITransaction) => {
  const query: Partial<ITransactionNotificationRead> = {
    transactionId: t.__id,
  };

  const db = getDB();

  const existingDoc = await db.transactionNotificationRead.getOne(query);
  if (existingDoc) {
    if (existingDoc.isRead && existingDoc.transactionStatus === t.status) {
      return;
    }

    await db.transactionNotificationRead.update(
      { __id: existingDoc.__id },
      { isRead: true, transactionStatus: t.status },
    );
  } else {
    await db.transactionNotificationRead.insert({
      transactionId: t.__id ?? '',
      isRead: true,
      transactionStatus: t.status,
    });
  }
};

export const markTransactionNotificationClicked = async (t: ITransaction) => {
  const query: Partial<ITransactionNotificationClick> = {
    transactionId: t.__id,
  };

  const db = getDB();

  const existingDoc = await db.transactionNotificationClick.getOne(query);
  if (existingDoc) {
    if (existingDoc.isClicked && existingDoc.transactionStatus === t.status) {
      return;
    }

    await db.transactionNotificationClick.update(
      { __id: existingDoc.__id },
      { isClicked: true, transactionStatus: t.status },
    );
  } else {
    await db.transactionNotificationClick.insert({
      transactionId: t.__id ?? '',
      isClicked: true,
      transactionStatus: t.status,
    });
  }
};

const getTransactionsNotifications = async (state: RootState) => {
  const db = getDB();
  const transactionClickedList = await db.transactionNotificationClick.getAll();
  const transactionReadList = await db.transactionNotificationRead.getAll();

  const transactions = state.transaction.transactions
    .filter(t => {
      if (t.type === TransactionTypeMap.hidden) {
        return false;
      }

      const account = state.account.accounts.find(a => a.__id === t.accountId);
      if (!account?.meta?.created) {
        return false;
      }

      // handle subAccounts
      if (account.type === AccountTypeMap.subAccount) {
        const parentAccount = state.account.accounts.find(
          a => a.__id === account.parentAccountId,
        );

        if (!parentAccount?.meta?.created) {
          return false;
        }

        if (t.timestamp < parentAccount.meta.created) {
          return false;
        }
      }
      // handle main accounts
      else if (t.timestamp < account.meta.created) {
        return false;
      }

      return true;
    })
    .map(t => {
      const fromClickList = transactionClickedList.find(
        c => c.transactionId === t.__id,
      );
      const isClicked =
        fromClickList?.isClicked &&
        fromClickList.transactionStatus === t.status;

      return { ...t, isClicked: Boolean(isClicked) };
    });

  let totalUnread = transactions.length;

  for (const txn of transactions) {
    const fromReadList = transactionReadList.find(
      t => t.transactionId === txn.__id,
    );
    const isRead =
      fromReadList?.isRead && fromReadList.transactionStatus === txn.status;

    if (isRead) totalUnread -= 1;
  }

  return {
    transactions: lodash.orderBy(transactions, [t => t.timestamp], ['desc']),
    unRead: totalUnread,
  };
};

export const syncTransactionNotifications = createAsyncThunk<
  void,
  void,
  { state: RootState }
>('notification/syncTransactions', async (_params, { dispatch, getState }) => {
  const result = await getTransactionsNotifications(getState());
  dispatch(setTransactionNotifications(result));
});
