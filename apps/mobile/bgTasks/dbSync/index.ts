import { keyValueStore } from '@/db';
import { setLanguage, store } from '@/store';
import React, { useEffect } from 'react';

export const syncAllDb = async (isFirst: boolean) => {
  console.log('getting db');
  store.dispatch(setLanguage((await keyValueStore.appLanguage.get()) as any));
};

export const DatabaseListener: React.FC = () => {
  useEffect(() => {
    syncAllDb(true);
  }, []);

  return null;
};
