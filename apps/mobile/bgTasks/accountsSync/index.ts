import lodash from 'lodash';
import React, { useEffect } from 'react';

import { syncAllAccounts } from '@/actions';
import { selectAccountSync, useAppDispatch, useAppSelector } from '@/store';

const AUTO_RESYNC_INTERVAL = 3 * 60 * 1000;

export const AccountSyncTask: React.FC = () => {
  const dispatch = useAppDispatch();
  const { lastSyncedAt } = useAppSelector(selectAccountSync);

  const startSyncing = () => {
    console.log('should start sync');
    dispatch(syncAllAccounts());
  };

  const debouncedStartSyncing = lodash.debounce(
    startSyncing,
    AUTO_RESYNC_INTERVAL,
  );

  useEffect(() => {
    debouncedStartSyncing();
  }, [lastSyncedAt]);

  return null;
};
