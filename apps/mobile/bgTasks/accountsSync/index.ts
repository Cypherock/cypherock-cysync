import { debounce } from 'lodash';
import React, { useEffect } from 'react';

import { syncAllAccounts } from '@/actions';
import { selectAccountSync, useAppDispatch, useAppSelector } from '@/store';

const AUTO_RESYNC_INTERVAL = 5 * 60 * 1000;

export const AccountSyncTask: React.FC = () => {
  const dispatch = useAppDispatch();
  const { lastSyncedAt } = useAppSelector(selectAccountSync);

  const startSyncing = () => {
    if (!__DEV__) {
      dispatch(syncAllAccounts());
    }
  };

  const debouncedStartSyncing = debounce(startSyncing, AUTO_RESYNC_INTERVAL);

  useEffect(() => {
    if (lastSyncedAt) {
      debouncedStartSyncing();
    }
  }, [lastSyncedAt]);

  return null;
};
