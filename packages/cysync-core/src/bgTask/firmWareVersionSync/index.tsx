import React, { useEffect } from 'react';
import { useAppDispatch } from '~/store';
// import { openFirmwareReleaseNotesDialog } from '~/actions';
// import { keyValueStore } from '~/utils';
// import logger from '~/utils/logger';

export const VersionSyncTask: React.FC = () => {
  const dispatch = useAppDispatch();

  const checkVersion = async () => {
    //  need to add the logic to get and dispatch the latest firmware version
  };
  useEffect(() => {
    checkVersion();
  }, [dispatch]);

  return null;
};
