import React, { useEffect } from 'react';

import { syncWalletsWithDevice } from '~/actions';
import { useDevice } from '~/context';
import { useAppDispatch } from '~/store';

export const WalletSyncTask: React.FC = () => {
  const dispatch = useAppDispatch();

  const { connection } = useDevice();

  const onConnectionChange = async () => {
    dispatch(syncWalletsWithDevice(connection));
  };

  useEffect(() => {
    onConnectionChange();
  }, [connection]);

  return null;
};
