import { createSelector } from '@reduxjs/toolkit';
import lodash from 'lodash';
import React, { useCallback, useEffect } from 'react';

import { syncTransactionNotifications } from '@/actions';
import {
  selectTransactions,
  selectUnHiddenAccounts,
  selectWallets,
  useAppDispatch,
  useAppSelector,
} from '@/store';
import { getDB } from '@/utils';

const selector = createSelector(
  [selectWallets, selectUnHiddenAccounts, selectTransactions],
  ({ wallets }, { accounts }, { transactions }) => ({
    wallets,
    accounts,
    transactions,
  }),
);

export const NotificationSyncTask: React.FC = () => {
  const dispatch = useAppDispatch();
  const { transactions, accounts } = useAppSelector(selector);

  const debounceParseTransactionList = useCallback(
    lodash.throttle(() => dispatch(syncTransactionNotifications()), 1000, {
      leading: true,
    }),
    [dispatch],
  );

  useEffect(() => {
    const db = getDB();
    db.transactionNotificationRead.addListener(
      'change',
      debounceParseTransactionList,
    );
    db.transactionNotificationClick.addListener(
      'change',
      debounceParseTransactionList,
    );

    return () => {
      db.transactionNotificationRead.removeAllListener();
      db.transactionNotificationClick.removeAllListener();
    };
  }, [debounceParseTransactionList]);

  useEffect(() => {
    debounceParseTransactionList();
  }, [transactions, accounts]);

  return null;
};
