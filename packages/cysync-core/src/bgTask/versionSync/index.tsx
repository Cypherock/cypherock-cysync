import React, { useEffect } from 'react';

import { openReleaseNotesDialog } from '~/actions';
import { useAppDispatch } from '~/store';
import { keyValueStore } from '~/utils';
import logger from '~/utils/logger';

export const VersionSyncTask: React.FC = () => {
  const dispatch = useAppDispatch();

  const checkVersion = async () => {
    try {
      if (!(await keyValueStore.isOnboardingCompleted.get())) return;
      const storedVersion = await keyValueStore.cysyncVersion.get();
      const currentVersion = window.cysyncEnv.VERSION;
      if (!storedVersion || storedVersion !== currentVersion) {
        dispatch(openReleaseNotesDialog());
        await keyValueStore.cysyncVersion.set(currentVersion);
      }
    } catch (error) {
      logger.error(error);
    }
  };
  useEffect(() => {
    checkVersion();
  }, [dispatch]);

  return null;
};
