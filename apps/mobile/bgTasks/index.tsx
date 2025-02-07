import React, { useEffect } from 'react';
import { AccountSyncTask } from './accountsSync';
import { DatabaseListener } from './dbSync';
let render = 0;
export const BackgroundTasks = () => {
  useEffect(() => {
    console.log(`background task rendered ${render++} times`);
  }, []);
  return (
    <>
      <AccountSyncTask />
      <DatabaseListener />
    </>
  );
};
