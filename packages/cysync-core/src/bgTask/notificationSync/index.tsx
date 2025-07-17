import { createSelector } from '@reduxjs/toolkit';
import lodash from 'lodash';
import React, { useCallback, useEffect } from 'react';

import { syncTransactionNotifications } from '~/actions';
import { useAccounts } from '~/hooks';
import {
  selectDiscreetMode,
  selectTransactions,
  selectWallets,
  useAppDispatch,
  useAppSelector,
} from '~/store';
import { getDB } from '~/utils';

const selector = createSelector(
  [selectWallets, selectTransactions, selectDiscreetMode],
  ({ wallets }, { transactions }, { active: isDiscreetMode }) => ({
    wallets,
    transactions,
    isDiscreetMode,
  }),
);

export const NotificationSyncTask: React.FC = () => {
  const dispatch = useAppDispatch();
  const { transactions, isDiscreetMode } = useAppSelector(selector);
  const accounts = useAccounts();

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
