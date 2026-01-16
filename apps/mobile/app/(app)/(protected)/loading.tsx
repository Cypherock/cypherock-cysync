import React, { useCallback, useEffect, useRef, useState } from 'react';
import { LoaderScreen } from '@/components/ui';
import {
  selectAccountSync,
  selectLanguage,
  selectNetwork,
  useAppSelector,
  selectCurrency,
} from '@/store';
import { syncAllPriceHistories, syncAllPrices } from '@/actions';
import { Redirect, useFocusEffect } from 'expo-router';
import NoDataScreen from '@/components/ui/molecules/NoDataScreen';
import { syncAccountsDb } from '@/bgTasks/dbSync/helper';
import { debounce } from 'lodash';

export default function Loading() {
  const lang = useAppSelector(selectLanguage);
  const { currentCurrency } = useAppSelector(selectCurrency);
  const [status, setStatus] = useState(false);
  const [syncProgress, setSyncProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isPriceSyncComplete, setIsPriceSyncComplete] = useState(false);
  const [isPriceHistorySyncComplete, setIsPriceHistorySyncComplete] =
    useState(false);
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
      await syncAllPrices(currentCurrency);
      setIsPriceSyncComplete(true);
      await syncAllPriceHistories(currentCurrency);
      setIsPriceHistorySyncComplete(true);
      setStatus(true);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'An error occurred during sync',
      );
      setStatus(false);
    }
  }

  const reset = () => {
    setStatus(false);
    setSyncProgress(0);
    setError(null);
    setIsPriceSyncComplete(false);
    setIsPriceHistorySyncComplete(false);
    setIsFirst(true);
    accountSyncProgress.current = 0;
  };

  useEffect(() => {
    if (isFirst) {
      setIsFirst(false);
      return;
    }
    const syncMapValues = Object.values(accountSyncMap);
    let progress = 0;
    if (syncMapValues.length > 0) {
      const accountProgress = Math.round(
        (syncMapValues.filter(a => a?.syncState === 'synced').length /
          syncMapValues.length) *
          94,
      );
      progress += accountProgress;
    }
    if (isPriceSyncComplete) progress += 3;
    if (isPriceHistorySyncComplete) progress += 3;
    accountSyncProgress.current = progress;
    setSyncProgress(progress);
  }, [
    accountSyncMap,
    isPriceSyncComplete,
    isPriceHistorySyncComplete,
    isFirst,
  ]);

  useEffect(() => {
    const debouncedLoadData = debounce(() => {
      loadData();
    }, 300);

    debouncedLoadData();

    return () => {
      debouncedLoadData.cancel();
    };
  }, []);

  useFocusEffect(useCallback(() => reset, []));

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
