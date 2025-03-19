import React, { useEffect, useRef, useState } from 'react';
import { LoaderScreen } from '@/components/ui';
import {
  selectAccountSync,
  selectLanguage,
  selectNetwork,
  useAppSelector,
} from '@/store';
import { syncAllPriceHistories, syncAllPrices } from '@/actions';
import { Redirect } from 'expo-router';
import NoDataScreen from '@/components/ui/molecules/NoDataScreen';
import { syncAccountsDb } from '@/bgTasks/dbSync/helper';

export default function Loading() {
  const lang = useAppSelector(selectLanguage);
  const [status, setStatus] = useState(false);
  const { active } = useAppSelector(selectNetwork);
  const { syncState, syncError, accountSyncMap } =
    useAppSelector(selectAccountSync);

  /** Can be used to show sync progress */
  const accountSyncProgress = useRef(0);

  async function loadData() {
    try {
      await syncAllPriceHistories();
      await syncAllPrices();
      await syncAccountsDb(true);
      setStatus(true);
    } catch {
      setStatus(false);
    }
  }

  useEffect(() => {
    const syncMapValues = Object.values(accountSyncMap);
    accountSyncProgress.current = Math.round(
      (syncMapValues.filter(a => a?.syncState === 'synced').length /
        syncMapValues.length) *
        100,
    );
  }, [accountSyncMap]);

  useEffect(() => {
    loadData();
  }, []);

  if (!active || syncError)
    return (
      <NoDataScreen
        title={syncError ?? 'Please connect to the internet to continue!'}
        actionText={'Retry'}
        onAction={loadData}
      />
    );

  if (status && syncState === 'synced') {
    return <Redirect href={'/info'} />;
  }

  return <LoaderScreen title={lang.strings.scan.loading.description} />;
}
