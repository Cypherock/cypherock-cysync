import {
  syncWalletsOnDb,
  mapWalletsToDbInstance,
} from '@cypherock/cysync-core-services';
import { ConnectDevice } from '@cypherock/cysync-interfaces';
import { ManagerApp } from '@cypherock/sdk-app-manager';
import { logger } from '@cypherock/sdk-core/dist/utils';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { uniqueId } from 'lodash';

import {
  DeviceConnectionStatus,
  IDeviceConnectionInfo,
  deviceLock,
} from '~/context';
import { RootState, setDeletedWallets, setWallets } from '~/store';
import { getDB } from '~/utils';

const syncWalletsWithConnectedDevice = async (
  connection?: IDeviceConnectionInfo,
) => {
  if (
    !connection?.isMain ||
    connection.status !== DeviceConnectionStatus.CONNECTED
  ) {
    return undefined;
  }

  if (!connection.serial) {
    logger.warn('No serial found for connected device');
    return undefined;
  }

  const db = getDB();

  return syncWalletsOnDb({
    db,
    wallets: connection.walletList ?? [],
    deviceId: connection.serial,
  });
};

export const syncWalletsWithDevice = createAsyncThunk<
  void,
  IDeviceConnectionInfo | undefined,
  { state: RootState }
>('wallets/syncWithDevice', async (connection, { dispatch }) => {
  const deletedWallets = await syncWalletsWithConnectedDevice(connection);

  dispatch(setDeletedWallets(deletedWallets ?? []));
});

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
    if (connection && connection.status === DeviceConnectionStatus.CONNECTED) {
      if (!connection.serial) {
        logger.warn('No serial found for connected device');
      } else {
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
      }
    }
  },
);
