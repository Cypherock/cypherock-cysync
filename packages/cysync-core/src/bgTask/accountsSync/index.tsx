import lodash from 'lodash';
import React, { useEffect } from 'react';

import { syncAllAccounts } from '~/actions';
import { useCurrency } from '~/context';
import { selectAccountSync, useAppDispatch, useAppSelector } from '~/store';

const AUTO_RESYNC_INTERVAL = 3 * 60 * 1000;

export const AccountSyncTask: React.FC = () => {
  const dispatch = useAppDispatch();
  const { lastSyncedAt } = useAppSelector(selectAccountSync);
  const { currentCurrency } = useCurrency();

  const startSyncing = () => {
    if (window.cysyncEnv.IS_PRODUCTION === 'true') {
      dispatch(syncAllAccounts(currentCurrency));
    }
  };

  const debouncedStartSyncing = lodash.debounce(
    startSyncing,
    AUTO_RESYNC_INTERVAL,
    {
      leading: false,
      trailing: true,
    },
  );

  useEffect(() => {
    if (lastSyncedAt) {
      debouncedStartSyncing();
    }
  }, [lastSyncedAt]);

  return null;
};
