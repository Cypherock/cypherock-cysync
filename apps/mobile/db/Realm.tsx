import { RealmProvider, useRealm } from '@realm/react';
import React, { PropsWithChildren, useEffect } from 'react';
import { getDB } from './db';

import { useAppDispatch } from '../store';
import { updateAccounts } from '../store/accounts';
import { updateWallets } from '../store/wallets';
import { AccountType, IAccount, IWallet } from '@cypherock/db-interfaces';
import { Wallet } from './models/Wallet';
import { Account } from './models/Account';

const RealmSync = () => {
  const realm = useRealm();
  const dispatch = useAppDispatch();

  useEffect(() => {
    const wallets = realm.objects<Wallet>('Wallet');
    const accounts = realm.objects<Account>('Account');

    const walletListener = () => {
      const walletsData: IWallet[] = wallets.map(wallet => ({
        _id: wallet.__id,
        name: wallet.name,
        hasPin: wallet.hasPin,
        hasPassphrase: wallet.hasPassphrase,
        deviceId: wallet.deviceId,
      }));
      dispatch(updateWallets(walletsData));
    };

    const accountListener = () => {
      const accountsData: IAccount[] = accounts.map(account => ({
        _id: account.__id,
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
    };

    wallets.addListener(walletListener);
    accounts.addListener(accountListener);

    return () => {
      wallets.removeListener(walletListener);
      accounts.removeListener(accountListener);
    };
  }, [realm, dispatch]);

  return null;
};

export const CustomRealmProvider = ({ children }: PropsWithChildren) => {
  const [database, setDatabase] = React.useState<Realm | null>(null);

  useEffect(() => {
    const initializeDatabase = async () => {
      const dbInstance = await getDB();
      if (dbInstance.database) setDatabase(dbInstance.database);
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
