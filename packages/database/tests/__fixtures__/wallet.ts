import {
  IDatabase,
  IWallet,
  IWalletRepository,
} from '@cypherock/db-interfaces';
import { ITestClass } from './types';

class WalletData implements ITestClass<IWallet> {
  name = 'Wallet';

  repo: IWalletRepository;

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

  partial = [];

  all = [];

  setRepository(db: IDatabase) {
    this.repo = db.wallet;
  }
}
export const walletData = new WalletData();
