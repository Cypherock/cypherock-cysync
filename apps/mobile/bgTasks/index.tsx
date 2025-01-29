import React from 'react';
import { AccountSyncTask } from './accountsSync';
import { DatabaseListener } from './dbSync';

export const BackgroundTasks = () => (
  <>
    <AccountSyncTask />
    <DatabaseListener />
  </>
);
