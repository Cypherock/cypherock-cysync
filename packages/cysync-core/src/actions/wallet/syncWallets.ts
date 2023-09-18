import { syncWalletsOnDb } from '@cypherock/cysync-core-services';
import { ConnectDevice } from '@cypherock/cysync-interfaces';
import { ManagerApp } from '@cypherock/sdk-app-manager';
import { ActionReducerMapBuilder, createAsyncThunk } from '@reduxjs/toolkit';
import { uniqueId } from 'lodash';

import {
  DeviceConnectionStatus,
  deviceLock,
  IDeviceConnectionInfo,
} from '~/context';
import { IWalletState, RootState, setDeletedWallets } from '~/store';
import { getDB } from '~/utils';
import logger from '~/utils/logger';

export interface ISyncWalletsWithDeviceParams {
  connection?: IDeviceConnectionInfo;
  connectDevice: ConnectDevice;
  doFetchFromDevice?: boolean;
}

const syncWalletsWithConnectedDevice = async (
  params: ISyncWalletsWithDeviceParams,
) => {
  const { connection, connectDevice, doFetchFromDevice } = params;

  if (
    !connection?.isMain ||
    connection.status !== DeviceConnectionStatus.CONNECTED ||
    !connection.isAuthenticated
  ) {
    return undefined;
  }

  if (!connection.serial) {
    logger.warn('No serial found for connected device');
    return undefined;
  }

  let walletList = connection.walletList ?? [];

  if (doFetchFromDevice) {
    const taskId = uniqueId('task-');
    deviceLock.acquire(connection.device, taskId);

    const con = await connectDevice(connection.device);
    const app = await ManagerApp.create(con);

    const deviceResult = await app.getWallets();
    walletList = deviceResult.walletList;

    await app.destroy();
    deviceLock.release(connection.device, taskId);
  }

  const db = getDB();

  return syncWalletsOnDb({
    db,
    wallets: walletList,
    deviceId: connection.serial,
  });
};

export const syncWalletsWithDevice = createAsyncThunk<
  void,
  ISyncWalletsWithDeviceParams,
  { state: RootState }
>('wallets/syncWithDevice', async (params, { dispatch }) => {
  const deletedWallets = await syncWalletsWithConnectedDevice(params);

  dispatch(setDeletedWallets(deletedWallets ?? []));
});

export const addSyncWalletsWithDeviceReducer = (
  builder: ActionReducerMapBuilder<IWalletState>,
) => {
  builder
    .addCase(syncWalletsWithDevice.pending, state => {
      state.syncWalletStatus = 'loading';
    })
    .addCase(syncWalletsWithDevice.fulfilled, state => {
      state.syncWalletStatus = 'succeeded';
    })
    .addCase(syncWalletsWithDevice.rejected, state => {
      state.syncWalletStatus = 'failed';
    });
};
