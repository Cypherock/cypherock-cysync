import React, { useEffect } from 'react';

import { openWalletSyncErrorDialog, syncWalletsWithDevice } from '~/actions';
import { useDevice } from '~/context';
import { selectWallets, useAppDispatch, useAppSelector } from '~/store';

export const WalletSyncTask: React.FC = () => {
  const dispatch = useAppDispatch();
  const { deletedWallets, deleteWalletStatus } = useAppSelector(selectWallets);

  const { connection } = useDevice();

  const onConnectionChange = async () => {
    dispatch(syncWalletsWithDevice({ connection }));
  };

  const onDeleteChange = () => {
    dispatch(openWalletSyncErrorDialog());
  };

  useEffect(() => {
    onConnectionChange();
  }, [connection]);

  useEffect(() => {
    if (deletedWallets.length > 0 && deleteWalletStatus === 'idle')
      onDeleteChange();
  }, [deletedWallets]);

  return null;
};
