import {
  IDatabase,
  IWallet,
  IWalletRepository,
} from '@cypherock/db-interfaces';

import { ITestClass } from './types';

class WalletData implements ITestClass<IWallet> {
  name = 'Wallet';

  sortKey = 'name';

  isSortDescending = false;

  repo: IWalletRepository;

  sorted: IWallet[] = [
    {
      name: 'DEF',
      hasPassphrase: true,
      hasPin: true,
      deviceId: '1',
    },
    {
      name: 'DIFFERENT WALLET',
      hasPassphrase: false,
      hasPin: false,
      deviceId: '2',
    },
    {
      name: 'DIFFERENT WALLET AGAIN',
      hasPassphrase: true,
      hasPin: false,
      deviceId: '2',
    },
    {
      name: 'GMT',
      hasPassphrase: false,
      hasPin: true,
      deviceId: '1',
    },
  ];

  onlyRequired: IWallet[] = [
    {
      name: 'DEF',
      hasPassphrase: true,
      hasPin: true,
      deviceId: '1',
    },
    {
      name: 'GMT',
      hasPassphrase: false,
      hasPin: true,
      deviceId: '1',
    },
    {
      name: 'DIFFERENT WALLET',
      hasPassphrase: false,
      hasPin: false,
      deviceId: '2',
    },
    {
      name: 'DIFFERENT WALLET AGAIN',
      hasPassphrase: true,
      hasPin: false,
      deviceId: '2',
    },
  ];

  partial: Partial<IWallet>[] = [
    {
      hasPassphrase: true,
      hasPin: true,
      deviceId: '1',
    },
    {
      name: 'GMT',
      hasPin: true,
      deviceId: '1',
    },
    {
      name: 'DIFFERENT WALLET',
      hasPassphrase: false,
      deviceId: '2',
    },
    {
      name: 'DIFFERENT WALLET AGAIN',
      hasPassphrase: true,
      hasPin: false,
    },
  ];

  all = this.onlyRequired;

  invalid: IWallet[] = [
    {
      name: null as any,
      hasPassphrase: 45 as any,
      hasPin: 'random' as any,
      deviceId: 33 as any,
    },
    {
      name: null as any,
      hasPassphrase: false,
      hasPin: true,
      deviceId: '1',
    },
    {
      name: 'DIFFERENT WALLET',
      hasPassphrase: 45 as any,
      hasPin: false,
      deviceId: '2',
    },
    {
      name: 'DIFFERENT WALLET AGAIN',
      hasPassphrase: true,
      hasPin: 'random' as any,
      deviceId: '2',
    },
    {
      name: 'Wallet name',
      hasPassphrase: true,
      hasPin: false,
      deviceId: 33 as any,
    },
  ];

  setRepository(db: IDatabase) {
    this.repo = db.wallet;
  }
}
export const walletData = new WalletData();
