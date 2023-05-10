import {
  IDatabase,
  IAccount,
  IAccountRepository,
} from '@cypherock/db-interfaces';
import { ITestClass } from './types';

class AccountData implements ITestClass<IAccount> {
  name = 'Account';

  repo: IAccountRepository;

  onlyRequired: IAccount[] = [
    {
      name: 'Big name 78b25d27-bb93-4df5-8cdc-e17af3bff890',
      xpubOrAddress: 'address',
      balance: '20.3434',
      unit: 'USD',
      derivationPath: 'm/44',
      type: 'erc20',
      assetId: 'etc',
      walletId: '1234',
    },
    {
      name: 'Ethereum 1',
      xpubOrAddress: '0x24u302482349243u9c9',
      balance: '49.3434',
      unit: 'ETH',
      derivationPath: 'm/44/0/0',
      type: 'account',
      assetId: 'eth',
      walletId: '3948',
    },
    {
      name: 'Bitcoin 3',
      xpubOrAddress: 'xpub19249032209f980d028',
      balance: '0',
      unit: 'BTC',
      derivationPath: '',
      type: 'child',
      assetId: 'btc',
      walletId: '56789093876',
    },
    {
      name: 'account name',
      xpubOrAddress: '0838408347237408d0s8a08r80a8d9f08',
      balance: '0.0000000000003434',
      unit: 'Near',
      derivationPath: 'm/44/0/0/185',
      type: 'asset',
      assetId: 'near',
      walletId: '6789087',
    },
  ];

  partial = [];

  all = [];

  invalid: IAccount[] = [
    {
      name: null as any,
      xpubOrAddress: 236923 as any,
      balance: {} as any,
      unit: [] as any,
      derivationPath: [1, 2] as any,
      type: 80 as any,
      assetId: null as any,
      walletId: 0 as any,
    },
    {
      name: null as any,
      xpubOrAddress: 'address',
      balance: '20.3434',
      unit: 'USD',
      derivationPath: 'm/44',
      type: 'erc20',
      assetId: 'etc',
      walletId: '1234',
    },
    {
      name: 'account name',
      xpubOrAddress: 236923 as any,
      balance: '20.3434',
      unit: 'USD',
      derivationPath: 'm/44',
      type: 'erc20',
      assetId: 'etc',
      walletId: '1234',
    },
    {
      name: 'account name',
      xpubOrAddress: 'address',
      balance: {} as any,
      unit: 'USD',
      derivationPath: 'm/44',
      type: 'erc20',
      assetId: 'etc',
      walletId: '1234',
    },
    {
      name: 'account name',
      xpubOrAddress: 'address',
      balance: '20.3434',
      unit: [] as any,
      derivationPath: 'm/44',
      type: 'erc20',
      assetId: 'etc',
      walletId: '1234',
    },
    {
      name: 'account name',
      xpubOrAddress: 'address',
      balance: '20.3434',
      unit: 'USD',
      derivationPath: [1, 2] as any,
      type: 'erc20',
      assetId: 'etc',
      walletId: '1234',
    },
    {
      name: 'account name',
      xpubOrAddress: 'address',
      balance: '20.3434',
      unit: 'USD',
      derivationPath: 'm/44',
      type: 80 as any,
      assetId: 'etc',
      walletId: '1234',
    },
    {
      name: 'account name',
      xpubOrAddress: 'address',
      balance: '20.3434',
      unit: 'USD',
      derivationPath: 'm/44',
      type: 'erc20',
      assetId: null as any,
      walletId: '1234',
    },
    {
      name: 'account name',
      xpubOrAddress: 'address',
      balance: '20.3434',
      unit: 'USD',
      derivationPath: 'm/44',
      type: 'erc20',
      assetId: 'etc',
      walletId: 0 as any,
    },
  ];

  setRepository(db: IDatabase) {
    this.repo = db.account;
  }
}
export const accountData = new AccountData();
