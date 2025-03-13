import React, { useEffect, useState } from 'react';
import { LoaderScreen, Typography } from '@/components/ui';
import { selectLanguage, selectNetwork, useAppSelector } from '@/store';
import { syncAllPriceHistories, syncAllPrices } from '@/actions';
import { Redirect } from 'expo-router';
import NoDataScreen from '@/components/ui/molecules/NoDataScreen';

export default function Loading() {
  const lang = useAppSelector(selectLanguage);
  const [status, setStatus] = useState(false);
  const { active } = useAppSelector(selectNetwork);

  async function loadData() {
    try {
      await syncAllPriceHistories();
      await syncAllPrices();
      setStatus(true);
    } catch {
      setStatus(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  if (!active)
    return (
      <NoDataScreen
        title={'Please connect to the internet to continue!'}
        actionText={'Retry'}
        onAction={loadData}
      />
    );

  if (status) {
    return <Redirect href={'/info'} />;
  }

  return <LoaderScreen title={lang.strings.scan.loading.description} />;
}
