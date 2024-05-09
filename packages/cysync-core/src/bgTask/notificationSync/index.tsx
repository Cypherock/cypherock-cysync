import { createSelector } from '@reduxjs/toolkit';
import lodash from 'lodash';
import React, { useCallback, useEffect } from 'react';

import { syncTransactionNotifications } from '~/actions';
import {
  selectDiscreetMode,
  selectTransactions,
  selectUnHiddenAccounts,
  useAppDispatch,
  useShallowEqualAppSelector,
} from '~/store';
import { getDB } from '~/utils';

const selector = createSelector(
  [selectUnHiddenAccounts, selectTransactions, selectDiscreetMode],
  ({ accounts }, { transactions }, { active: isDiscreetMode }) => ({
    accounts,
    transactions,
    isDiscreetMode,
  }),
);

export const NotificationSyncTask: React.FC = () => {
  const dispatch = useAppDispatch();
  const { transactions, accounts, isDiscreetMode } = useShallowEqualAppSelector(selector);

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
