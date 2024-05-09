import { createSelector } from '@reduxjs/toolkit';
import lodash from 'lodash';
import React, { useCallback, useEffect } from 'react';

import { syncAllAccounts } from '~/actions';
import { selectAccountSync, useAppDispatch, useAppSelector } from '~/store';

const AUTO_RESYNC_INTERVAL = 3 * 60 * 1000;

const selector = createSelector(
  [selectAccountSync],
  ({ lastSyncedAt }) => lastSyncedAt,
);

export const AccountSyncTask: React.FC = () => {
  const dispatch = useAppDispatch();
  const lastSyncedAt = useAppSelector(selector);

  const startSyncing = () => {
    if (window.cysyncEnv.IS_PRODUCTION === 'true') {
      dispatch(syncAllAccounts());
    }
  };

  const debouncedStartSyncing = useCallback(
    lodash.debounce(startSyncing, AUTO_RESYNC_INTERVAL),
    [],
  );

  useEffect(() => {
    console.log('Last synced at: ', lastSyncedAt);
    if (lastSyncedAt) {
      debouncedStartSyncing();
    }
  }, [lastSyncedAt]);

  return null;
};
