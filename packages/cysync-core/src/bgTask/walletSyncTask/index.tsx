import React, { useEffect } from 'react';

import { openWalletSyncErrorDialog, syncWalletsWithDevice } from '~/actions';
import { useDevice } from '~/context';
import {
  selectWallets,
  setDeletedWallets,
  useAppDispatch,
  useAppSelector,
} from '~/store';
import { IWallet } from '@cypherock/db-interfaces';

export const WalletSyncTask: React.FC = () => {
  const dispatch = useAppDispatch();
  const { deletedWallets } = useAppSelector(selectWallets);

  const { connection } = useDevice();

  const onConnectionChange = async () => {
    dispatch(syncWalletsWithDevice(connection));
  };

  const onDeleteChange = () => {
    dispatch(openWalletSyncErrorDialog());
  };

  useEffect(() => {
    onConnectionChange();
  }, [connection]);

  useEffect(() => {
    console.log('useEffect', deletedWallets);
    const newIW = {
      name: 'fregerg',
      hasPin: false,
      hasPassphrase: false,
      // foreign keys
      deviceId: 'fefwef',
      __id: 'asfw',
    } as IWallet;
    if (deletedWallets.length === 0) {
      console.log('changed', [...deletedWallets, newIW]);
      setDeletedWallets([...deletedWallets, newIW]);
    } else onDeleteChange();
  }, [deletedWallets]);

  return null;
};
