import { syncWalletsOnDb } from '@cypherock/cysync-core-services';
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
  doFetchFromDevice?: boolean;
}

const syncWalletsWithConnectedDevice = async (
  params: ISyncWalletsWithDeviceParams,
) => {
  let taskId: string | undefined;
  const { connection, doFetchFromDevice } = params;

  try {
    if (
      !connection?.connection ||
      !connection.isMain ||
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
      taskId = uniqueId('task-');
      await deviceLock.acquire(connection.device, taskId);

      const con = connection.connection;
      const app = await ManagerApp.create(con);

      const deviceResult = await app.getWallets();
      walletList = deviceResult.walletList;

      deviceLock.release(connection.device, taskId);
    }

    const db = getDB();

    return syncWalletsOnDb({
      db,
      wallets: walletList,
      deviceId: connection.serial,
    });
  } catch (error) {
    if (taskId && connection?.device) {
      deviceLock.release(connection.device, taskId);
    }

    logger.error('Error while syncing wallets');
    logger.error(error);
    throw error;
  }
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
