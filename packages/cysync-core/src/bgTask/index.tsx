import React from 'react';

import { AccountSyncTask } from './accountsSync';
import { DatabaseListener } from './dbListener';
import { DeviceHandlingTask } from './deviceHandlingTask';
import { NotificationSyncTask } from './notificationSync';
import { PriceSyncTask } from './pricesSync';
import { WalletSyncTask } from './walletSyncTask';

export const BackgroundTasks = () => (
  <>
    <AccountSyncTask />
    <PriceSyncTask />
    <DatabaseListener />
    <WalletSyncTask />
    <DeviceHandlingTask />
    <NotificationSyncTask />
  </>
);
