import React from 'react';
import { DatabaseListener } from './dbListener';
import { WalletSyncTask } from './walletSyncTask';

export const BackgroundTasks = () => (
  <>
    <DatabaseListener />
    <WalletSyncTask />
  </>
);
