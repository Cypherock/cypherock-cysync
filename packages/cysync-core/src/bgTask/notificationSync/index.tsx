import { createSelector } from '@reduxjs/toolkit';
import lodash from 'lodash';
import React, { useCallback, useEffect } from 'react';

import { syncTransactionNotifications } from '~/actions';
import {
  selectAccounts,
  selectDiscreetMode,
  selectTransactions,
  selectWallets,
  useAppDispatch,
  useAppSelector,
} from '~/store';

const selector = createSelector(
  [selectWallets, selectAccounts, selectTransactions, selectDiscreetMode],
  (
    { wallets },
    { accounts },
    { transactions },
    { active: isDiscreetMode },
  ) => ({
    wallets,
    accounts,
    transactions,
    isDiscreetMode,
  }),
);

export const NotificationSyncTask: React.FC = () => {
  const dispatch = useAppDispatch();
  const { transactions, accounts, isDiscreetMode } = useAppSelector(selector);

  const debounceParseTransactionList = useCallback(
    lodash.throttle(() => dispatch(syncTransactionNotifications()), 1000, {
      leading: true,
    }),
    [dispatch],
  );

  useEffect(() => {
    debounceParseTransactionList();
  }, [transactions, accounts, isDiscreetMode]);

  return null;
};
