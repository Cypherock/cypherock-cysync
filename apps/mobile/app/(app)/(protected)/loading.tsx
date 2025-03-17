import React, { useEffect, useState } from 'react';
import { LoaderScreen } from '@/components/ui';
import {
  selectAccounts,
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
  const { accounts } = useAppSelector(selectAccounts);
  const { syncState, syncError, accountSyncMap } =
    useAppSelector(selectAccountSync);

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
    console.log({ accountSyncMap, accounts });
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
