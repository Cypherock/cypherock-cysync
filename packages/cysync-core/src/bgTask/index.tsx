import React from 'react';

import { AccountSyncTask } from './accountsSync';
import { DatabaseListener } from './dbListener';
import { WalletSyncTask } from './walletSyncTask';

export const BackgroundTasks = () => (
  <>
    <AccountSyncTask />
    <DatabaseListener />
    <WalletSyncTask />
  </>
);
