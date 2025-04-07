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
import { debounce } from 'lodash';

export default function Loading() {
  const lang = useAppSelector(selectLanguage);
  const [status, setStatus] = useState(false);
  const [syncProgress, setSyncProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const { active } = useAppSelector(selectNetwork);
  const { syncState, syncError, accountSyncMap } =
    useAppSelector(selectAccountSync);
  const [isFirst, setIsFirst] = useState(true);

  /** Can be used to show sync progress */
  const accountSyncProgress = useRef(0);

  async function loadData() {
    setError(null);
    try {
      await syncAccountsDb(true);
      await syncAllPrices();
      await syncAllPriceHistories();
      setStatus(true);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'An error occurred during sync',
      );
      setStatus(false);
    }
  }

  useEffect(() => {
    if (isFirst) {
      setIsFirst(false);
      return;
    }
    const syncMapValues = Object.values(accountSyncMap);
    if (syncMapValues.length > 0) {
      const progress = Math.round(
        (syncMapValues.filter(a => a?.syncState === 'synced').length /
          syncMapValues.length) *
          100,
      );
      accountSyncProgress.current = progress;
      setSyncProgress(progress);
    }
  }, [accountSyncMap]);

  useEffect(() => {
    const debouncedLoadData = debounce(() => {
      loadData();
    }, 300);

    debouncedLoadData();

    return () => {
      debouncedLoadData.cancel();
    };
  }, []);

  if (!active) {
    return (
      <NoDataScreen
        title={'Please connect to the internet to continue!'}
        actionText={'Retry'}
        onAction={loadData}
      />
    );
  }

  if (syncError || error) {
    return (
      <NoDataScreen
        title={syncError || error || 'Sync failed. Please try again.'}
        actionText={'Retry'}
        onAction={loadData}
      />
    );
  }

  if (status && syncState === 'synced') {
    return <Redirect href={'/info'} />;
  }

  return (
    <LoaderScreen
      title={lang.strings.scan.loading.description}
      progress={syncProgress}
      showProgress={true}
    />
  );
}
