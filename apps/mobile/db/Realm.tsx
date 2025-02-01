import { RealmProvider } from '@realm/react';
import React, { PropsWithChildren, useEffect } from 'react';
import { createDB } from './db';

import { useAppDispatch } from '../store';
import { updateAccounts } from '../store/accounts';
import { updateWallets } from '../store/wallets';
import { AccountType, IAccount, IWallet } from '@cypherock/db-interfaces';
import { getDB, setDB } from '@/utils';

const RealmSync = () => {
  const realm = getDB();
  const dispatch = useAppDispatch();

  useEffect(() => {
    const walletRepository = realm.wallet;
    const accountRepository = realm.account;

    const walletListener = async () => {
      try {
        const walletsResult = await walletRepository.getAll();
        const walletsData: IWallet[] = walletsResult.map(wallet => ({
          __id: wallet.__id,
          name: wallet.name,
          hasPin: wallet.hasPin,
          hasPassphrase: wallet.hasPassphrase,
          deviceId: wallet.deviceId,
        }));
        dispatch(updateWallets(walletsData));
      } catch (error) {
        console.log('couldnt get wallets', error);
      }
    };

    const accountListener = async () => {
      try {
        const accountsResult = await accountRepository.getAll();
        const accountsData: IAccount[] = accountsResult.map(account => ({
          __id: account.__id,
          name: account.name,
          walletId: account.walletId,
          xpubOrAddress: account.xpubOrAddress,
          balance: account.balance,
          derivationPath: account.derivationPath,
          type: account.type as AccountType,
          assetId: account.assetId,
          familyId: account.familyId,
          parentAssetId: account.parentAssetId,
        }));
        dispatch(updateAccounts(accountsData));
      } catch (error) {
        console.log('couldnt get accounts', error);
      }
    };

    walletRepository.addListener('change', walletListener);
    accountRepository.addListener('change', accountListener);

    return () => {
      walletRepository.removeListener('change', walletListener);
      accountRepository.removeListener('change', accountListener);
    };
  }, [realm, dispatch]);

  return null;
};

export const CustomRealmProvider = ({ children }: PropsWithChildren) => {
  const [database, setDatabase] = React.useState<Realm | null>(null);

  useEffect(() => {
    const initializeDatabase = async () => {
      const dbInstance = await createDB();
      setDB(dbInstance);
      const realm = dbInstance.getRealm();
      if (realm) setDatabase(realm);
    };

    initializeDatabase();
  }, []);

  if (!database) {
    return null;
  }

  return (
    <RealmProvider realm={database}>
      <RealmSync />
      {children}
    </RealmProvider>
  );
};
