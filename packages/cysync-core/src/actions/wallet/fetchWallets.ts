import {
  syncWalletsOnDb,
  mapWalletsToDbInstance,
} from '@cypherock/cysync-core-services';
import { ConnectDevice } from '@cypherock/cysync-interfaces';
import { ManagerApp } from '@cypherock/sdk-app-manager';
import { logger } from '@cypherock/sdk-core/dist/utils';
import { createAsyncThunk, ActionReducerMapBuilder } from '@reduxjs/toolkit';
import { uniqueId } from 'lodash';

import {
  DeviceConnectionStatus,
  IDeviceConnectionInfo,
  deviceLock,
} from '~/context';
import {
  IWalletState,
  RootState,
  setDeletedWallets,
  setWallets,
} from '~/store';
import { getDB } from '~/utils';

export const fetchWalletsAndSync = createAsyncThunk<
  void,
  {
    connection: IDeviceConnectionInfo | undefined;
    connectDevice: ConnectDevice;
  },
  { state: RootState }
>(
  'wallets/fetchAndSync',
  async ({ connection, connectDevice }, { dispatch }) => {
    if (!connection || connection.status !== DeviceConnectionStatus.CONNECTED)
      return Promise.reject();

    if (!connection.serial) {
      logger.warn('No serial found for connected device');
      return Promise.reject();
    }
    const taskId = uniqueId('task-');
    deviceLock.acquire(connection.device, taskId);

    const con = await connectDevice(connection.device);
    const app = await ManagerApp.create(con);

    const { walletList } = await app.getWallets();

    app.destroy();
    deviceLock.release(connection.device, taskId);

    const db = getDB();
    const deletedWallets = await syncWalletsOnDb({
      db,
      wallets: walletList ?? [],
      deviceId: connection.serial,
    });

    const wallets = mapWalletsToDbInstance(walletList, connection.serial);
    dispatch(setWallets(wallets));
    dispatch(setDeletedWallets(deletedWallets));

    return Promise.resolve();
  },
);

export const addFetchWalletsReducer = (
  builder: ActionReducerMapBuilder<IWalletState>,
) => {
  builder
    .addCase(fetchWalletsAndSync.pending, state => {
      state.syncWalletStatus = 'loading';
    })
    .addCase(fetchWalletsAndSync.fulfilled, state => {
      state.syncWalletStatus = 'succeeded';
    })
    .addCase(fetchWalletsAndSync.rejected, state => {
      state.syncWalletStatus = 'failed';
    });
};
