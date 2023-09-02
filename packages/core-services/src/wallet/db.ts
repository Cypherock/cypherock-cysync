import { IDatabase, IWallet } from '@cypherock/db-interfaces';

export const insertWallets = async (db: IDatabase, wallets: IWallet[]) => {
  if (wallets.length > 0) {
    await db.wallet.insert(wallets);
  }
};

export const updateWallets = async (db: IDatabase, wallets: IWallet[]) => {
  for (const updatedWallet of wallets) {
    if (updatedWallet.__id === undefined) {
      continue;
    }

    await db.wallet.update({ __id: updatedWallet.__id }, updatedWallet);
  }
};

export const deleteWallets = async (db: IDatabase, wallets: IWallet[]) => {
  for (const deletedWallet of wallets) {
    if (deletedWallet.__id === undefined) {
      continue;
    }

    await db.account.remove({ walletId: deletedWallet.__id });
    await db.wallet.remove({ __id: deletedWallet.__id });
    await db.transaction.remove({ walletId: deletedWallet.__id });
  }
};
