import { IWallet } from '@cypherock/db-interfaces';

interface IWalletTestData {
  insertWallets: {
    valid: IWallet[][];
    invalid: IWallet[][];
  };
  updateWallets: {
    valid: IWallet[][];
    invalid: IWallet[][];
  };
  deleteWallets: {
    valid: IWallet[][];
    invalid: IWallet[][];
  };
}

export const walletTestData: IWalletTestData = {
  insertWallets: {
    valid: [
      [
        {
          deviceId: '1',
          name: 'Wallet 1',
          hasPassphrase: false,
          hasPin: false,
        },
        {
          deviceId: '2',
          name: 'Wallet 2',
          hasPassphrase: false,
          hasPin: false,
        },
      ],
    ],
    invalid: [[]],
  },
  updateWallets: {
    valid: [
      [
        {
          __id: '1',
          deviceId: '1',
          name: 'Updated Wallet 1',
          hasPassphrase: true,
          hasPin: false,
        },
        {
          __id: '2',
          deviceId: '2',
          name: 'Updated Wallet 2',
          hasPassphrase: false,
          hasPin: true,
        },
      ],
    ],
    invalid: [
      [
        {
          __id: '1',
          deviceId: '1',
          name: 'Updated Wallet 1',
          hasPassphrase: true,
          hasPin: false,
        },
        {
          deviceId: '2',
          name: 'Wallet 2',
          hasPassphrase: false,
          hasPin: true,
        },
      ],
    ],
  },
  deleteWallets: {
    valid: [
      [
        {
          __id: '1',
          deviceId: '1',
          name: 'Wallet 1',
          hasPassphrase: false,
          hasPin: false,
        },
        {
          __id: '2',
          deviceId: '2',
          name: 'Wallet 2',
          hasPassphrase: false,
          hasPin: false,
        },
      ],
    ],
    invalid: [
      [
        {
          __id: '1',
          deviceId: '1',
          name: 'Wallet 1',
          hasPassphrase: false,
          hasPin: false,
        },
        {
          deviceId: '2',
          name: 'Wallet 2',
          hasPassphrase: false,
          hasPin: true,
        },
      ],
    ],
  },
};
