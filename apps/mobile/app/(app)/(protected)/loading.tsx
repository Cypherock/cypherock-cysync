import React, { useEffect, useState } from 'react';
import { LoaderScreen } from '@/components/ui';
import { selectLanguage, useAppSelector } from '@/store';
import { syncAllPriceHistories, syncAllPrices } from '@/actions';
import { Redirect } from 'expo-router';

export default function Loading() {
  const lang = useAppSelector(selectLanguage);
  const [status, setStatus] = useState(false);

  async function loadData() {
    await syncAllPriceHistories();
    await syncAllPrices();
    setStatus(true);
  }

  useEffect(() => {
    loadData();
  }, []);

  if (status) {
    return <Redirect href={'/info'} />;
  }

  return <LoaderScreen title={lang.strings.scan.loading.description} />;
}
