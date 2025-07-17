import { createSelector } from '@reduxjs/toolkit';
import lodash from 'lodash';
import React, { useCallback, useEffect } from 'react';

import { syncTransactionNotifications } from '~/actions';
import { useAccounts, useTransactions } from '~/hooks';
import {
  selectDiscreetMode,
  selectWallets,
  useAppDispatch,
  useAppSelector,
} from '~/store';
import { getDB } from '~/utils';

const selector = createSelector(
  [selectWallets, selectDiscreetMode],
  ({ wallets }, { active: isDiscreetMode }) => ({
    wallets,
    isDiscreetMode,
  }),
);

export const NotificationSyncTask: React.FC = () => {
  const dispatch = useAppDispatch();
  const { isDiscreetMode } = useAppSelector(selector);
  const accounts = useAccounts();
  const transactions = useTransactions();

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
  }, [transactions, accounts, isDiscreetMode]);

  return null;
};
