import { IWallet } from '@cypherock/db-interfaces';
import { logger } from '@cypherock/sdk-core/dist/utils';
import { createAsyncThunk } from '@reduxjs/toolkit';
import lodash from 'lodash';

import { DeviceConnectionStatus, IDeviceConnectionInfo } from '~/context';
import { RootState, setDeletedWallets } from '~/store';
import { getDB } from '~/utils';

import {
  sameWalletIdComparator,
  walletDetailsComparator,
  mapWalletsToDbInstance,
} from './helper';

const getWalletDifferenceAnalysis = (
  walletsInDb: IWallet[],
  walletsOnDevice: IWallet[],
) => {
  const deletedWallets = lodash.differenceWith(
    walletsInDb,
    walletsOnDevice,
    sameWalletIdComparator,
  );

  const addedWallets = lodash.differenceWith(
    walletsOnDevice,
    walletsInDb,
    sameWalletIdComparator,
  );

  const walletsOnDbAndDevice = lodash.intersectionWith(
    walletsOnDevice,
    walletsInDb,
    sameWalletIdComparator,
  );

  const updatedWallets = lodash.differenceWith(
    walletsOnDbAndDevice,
    walletsInDb,
    walletDetailsComparator,
  );

  return { deletedWallets, addedWallets, updatedWallets };
};

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

  const walletsInDb = await db.wallet.getAll();
  const walletsOnDevice = mapWalletsToDbInstance(
    connection.walletList ?? [],
    connection.serial,
  );

  const analysis = getWalletDifferenceAnalysis(walletsInDb, walletsOnDevice);

  await insertWallets(analysis.addedWallets);
  await updateWallets(analysis.updatedWallets);

  return analysis.deletedWallets;
};

const insertWallets = async (wallets: IWallet[]) => {
  const db = getDB();

  if (wallets.length > 0) {
    await db.wallet.insert(wallets);
  }
};

const updateWallets = async (wallets: IWallet[]) => {
  const db = getDB();

  for (const updatedWallet of wallets) {
    if (updatedWallet.__id === undefined) {
      continue;
    }

    await db.wallet.update({ __id: updatedWallet.__id }, updatedWallet);
  }
};

export const syncWalletsWithDevice = createAsyncThunk<
  void,
  IDeviceConnectionInfo | undefined,
  { state: RootState }
>('wallets/syncWithDevice', async (conenction, { dispatch }) => {
  const deletedWallets = await syncWalletsWithConnectedDevice(conenction);

  dispatch(setDeletedWallets(deletedWallets ?? []));
});
