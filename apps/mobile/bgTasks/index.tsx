import React from 'react';
import { DatabaseListener } from './dbSync';
import { NotificationSyncTask } from './notificationSync';

export const BackgroundTasks = () => {
  return (
    <>
      <DatabaseListener />
      <NotificationSyncTask />
    </>
  );
};
