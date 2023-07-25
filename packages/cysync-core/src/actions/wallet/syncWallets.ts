import { syncWalletsOnDb } from '@cypherock/cysync-core-services';
import { logger } from '@cypherock/sdk-core/dist/utils';
import { createAsyncThunk } from '@reduxjs/toolkit';

import { DeviceConnectionStatus, IDeviceConnectionInfo } from '~/context';
import { RootState, setDeletedWallets } from '~/store';
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
