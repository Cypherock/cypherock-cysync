import React, { useEffect } from 'react';
import { AccountSyncTask } from './accountsSync';
import { DatabaseListener } from './dbSync';
import { PriceSyncTask } from './priceSync';
let render = 1;
export const BackgroundTasks = () => {
  useEffect(() => {
    console.log(`background task rendered ${render++} times`);
  }, []);
  return (
    <>
      <AccountSyncTask />
      <DatabaseListener />
      <PriceSyncTask />
    </>
  );
};
