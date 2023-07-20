import { IWallet, IDatabase } from '@cypherock/db-interfaces';
import { IWalletItem } from '@cypherock/sdk-app-manager';
import lodash from 'lodash';

import { insertWallets, updateWallets } from './db';
import {
  sameWalletIdComparator,
  walletDetailsComparator,
  mapWalletsToDbInstance,
} from './helpers';

export const getWalletDifferenceAnalysis = (
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

export const syncWalletsOnDb = async (params: {
  db: IDatabase;
  wallets: IWalletItem[];
  deviceId: string;
}) => {
  const { db, wallets, deviceId } = params;

  const walletsInDb = await db.wallet.getAll();
  const walletsOnDevice = mapWalletsToDbInstance(wallets, deviceId);

  const analysis = getWalletDifferenceAnalysis(walletsInDb, walletsOnDevice);

  await insertWallets(db, analysis.addedWallets);
  await updateWallets(db, analysis.updatedWallets);

  return analysis.deletedWallets;
};
