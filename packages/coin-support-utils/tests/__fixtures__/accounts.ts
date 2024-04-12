import { IAccount } from '@cypherock/db-interfaces';

export const accounts: IAccount[] = [
  {
    name: 'Bitcoin 1',
    xpubOrAddress: '',
    balance: '0',
    unit: 'BTC',
    derivationPath: "m/84'/0'/0'",
    type: 'account',
    familyId: 'bitcoin',
    assetId: 'bitcoin',
    parentAssetId: 'bitcoin',
    walletId:
      'c372af88f64e0a40439f97ee98a3a0a03e9b2ac348b464d0cab7f32ee8482298',
    derivationScheme: 'nativeSegwit',
    __version: 0,
    __id: 'da51cef8-aa25-4667-b2da-9b4ef78dcee2',
    extraData: {
      unconfirmedBalance: '0',
      derivationScheme: 'nativeSegwit',
    },
  },
  {
    name: 'Bitcoin 1',
    xpubOrAddress: '',
    balance: '20000',
    unit: 'BTC',
    derivationPath: "m/44'/0'/0'",
    type: 'account',
    familyId: 'bitcoin',
    assetId: 'bitcoin',
    parentAssetId: 'bitcoin',
    walletId: '',
    derivationScheme: 'legacy',
    __version: 0,
    __id: '54d86310-66e1-4ca5-ae6a-d7b6cd671eba',
    extraData: {
      unconfirmedBalance: '0',
      derivationScheme: 'legacy',
    },
  },
];
