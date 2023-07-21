import { IDatabase } from '@cypherock/db-interfaces';

import { querySelect } from '~/utils';

export const queryWallet = async (
  db: IDatabase,
  message = 'Select a wallet',
) => {
  const wallets = await db.wallet.getAll();

  if (wallets.length <= 0)
    throw new Error('No wallet found on cli, sync wallets first');

  const deletedWalletsOptions = wallets.map(w => ({
    name: w.name,
    value: w.__id,
  }));

  const selectedId = await querySelect(deletedWalletsOptions, message);

  const selectedWallet = wallets.find(w => w.__id === selectedId);

  if (!selectedWallet) {
    throw new Error('Invalid wallet selection');
  }

  return selectedWallet;
};
