import {
  deleteWallets,
  syncWalletsOnDb,
} from '@cypherock/cysync-core-services';
import { IDatabase } from '@cypherock/db-interfaces';
import { IWalletItem } from '@cypherock/sdk-app-manager';
import colors from 'colors/safe';

import { queryCheckbox } from '~/utils';

export const syncWallets = async (params: {
  db: IDatabase;
  wallets: IWalletItem[];
  deviceId: string;
}) => {
  const { db, wallets, deviceId } = params;

  const deletedWallets = await syncWalletsOnDb({
    db,
    wallets,
    deviceId,
  });

  if (deletedWallets.length <= 0) return;

  console.log(colors.red('Some wallets are deleted from the connected device'));

  const deletedWalletsOptions = deletedWallets.map(w => ({
    name: w.name,
    value: w.__id ?? '',
  }));

  const selectedIds = await queryCheckbox(
    deletedWalletsOptions,
    'Select the wallets you want to delete from CLI',
  );

  const selectedWalletsToDelete = deletedWallets.filter(
    w => w.__id && selectedIds.includes(w.__id),
  );

  if (selectedWalletsToDelete.length > 0) {
    console.log(
      colors.red(
        `Deleting wallets: ${selectedWalletsToDelete
          .map(w => w.name)
          .join(', ')}`,
      ),
    );

    await deleteWallets(db, selectedWalletsToDelete);
  } else {
    console.log(colors.grey('No wallets deleted'));
  }
};
