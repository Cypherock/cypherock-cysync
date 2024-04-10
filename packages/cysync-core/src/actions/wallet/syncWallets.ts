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

  logger.info('Wallet Sync Started');

  try {
    if (!connection?.connection) {
      logger.warn('Wallet Sync Abort: Connection is not set up');
      return undefined;
    }

    if (!connection.isMain) {
      logger.warn('Wallet Sync Abort: Device is not on main');
      return undefined;
    }

    if (connection.status !== DeviceConnectionStatus.CONNECTED) {
      logger.warn('Wallet Sync Abort: Device is not connected');
      return undefined;
    }

    if (!connection.isAuthenticated) {
      logger.warn('Wallet Sync Abort: Device is not authenticated');
      return undefined;
    }

    if (!connection.serial) {
      logger.warn('Wallet Sync Abort: No serial found for connected device');
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

    const deletedWallets = await syncWalletsOnDb({
      db,
      wallets: walletList,
      deviceId: connection.serial,
    });

    logger.info('Wallet Sync Completed');

    return deletedWallets;
  } catch (error) {
    if (taskId && connection?.device) {
      deviceLock.release(connection.device, taskId);
    }

    logger.error('Wallet Sync Abort', error as any);
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
