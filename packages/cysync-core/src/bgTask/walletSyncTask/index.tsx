import {createSelector} from '@reduxjs/toolkit';
import React, { useEffect } from 'react';

import { openWalletSyncErrorDialog, syncWalletsWithDevice } from '~/actions';
import { useDevice } from '~/context';
import { selectWallets, useAppDispatch, useShallowEqualAppSelector } from '~/store';

const selector = createSelector(
  [selectWallets],
  ({ deletedWallets, deleteWalletStatus }) => ({
    deletedWallets,
    deleteWalletStatus,
  }),
);

export const WalletSyncTask: React.FC = () => {
  const dispatch = useAppDispatch();
  const { deletedWallets, deleteWalletStatus } = useShallowEqualAppSelector(selector);

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
