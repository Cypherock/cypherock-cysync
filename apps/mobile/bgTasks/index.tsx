import React, { useEffect } from 'react';
import { DatabaseListener } from './dbSync';
import { NotificationSyncTask } from './notificationSync';

let render = 1;
export const BackgroundTasks = () => {
  useEffect(() => {
    console.log(`background task rendered ${render++} times`);
  }, []);
  return (
    <>
      <DatabaseListener />
      <NotificationSyncTask />
    </>
  );
};
