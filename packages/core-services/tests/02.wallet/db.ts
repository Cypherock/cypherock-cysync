import { IDatabase, IWallet } from '@cypherock/db-interfaces';
import { mockDb } from '../__mocks__/mocks';
import { insertWallets, updateWallets, deleteWallets } from '../../src';

describe('Wallet Operations', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('insertWallets', () => {
    test('should insert wallets into the database', async () => {
      const wallets: IWallet[] = [
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
      ];

      await insertWallets(mockDb as IDatabase, wallets);
      expect((mockDb as IDatabase).wallet.insert).toHaveBeenCalledWith(wallets);
    });

    test('should not insert wallets if the array is empty', async () => {
      const wallets: IWallet[] = [];

      await insertWallets(mockDb as IDatabase, wallets);
      expect((mockDb as IDatabase).wallet.insert).not.toHaveBeenCalled();
    });
  });

  describe('updateWallets', () => {
    test('should update wallets in the database', async () => {
      const wallets: IWallet[] = [
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
      ];

      await updateWallets(mockDb as IDatabase, wallets);

      expect((mockDb as IDatabase).wallet.update).toHaveBeenCalledTimes(
        wallets.length,
      );
      wallets.forEach(wallet => {
        expect((mockDb as IDatabase).wallet.update).toHaveBeenCalledWith(
          { __id: wallet.__id },
          wallet,
        );
      });
    });

    test('should skip wallets without an __id', async () => {
      const wallets: IWallet[] = [
        {
          __id: '1',
          deviceId: '1',
          name: 'Updated Wallet 1',
          hasPassphrase: true,
          hasPin: false,
        },
        { deviceId: '2', name: 'Wallet 2', hasPassphrase: false, hasPin: true },
      ];

      await updateWallets(mockDb as IDatabase, wallets);

      expect((mockDb as IDatabase).wallet.update).toHaveBeenCalledTimes(1);
      expect((mockDb as IDatabase).wallet.update).toHaveBeenCalledWith(
        { __id: '1' },
        wallets[0],
      );
    });
  });

  describe('deleteWallets', () => {
    test('should delete wallets from the database', async () => {
      const wallets: IWallet[] = [
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
      ];

      await deleteWallets(mockDb as IDatabase, wallets);

      wallets.forEach(wallet => {
        expect((mockDb as IDatabase).account.remove).toHaveBeenCalledWith({
          walletId: wallet.__id,
        });
        expect((mockDb as IDatabase).wallet.remove).toHaveBeenCalledWith({
          __id: wallet.__id,
        });
        expect((mockDb as IDatabase).transaction.remove).toHaveBeenCalledWith({
          walletId: wallet.__id,
        });
      });
    });

    test('should skip wallets without an __id', async () => {
      const wallets: IWallet[] = [
        {
          __id: '1',
          deviceId: '1',
          name: 'Wallet 1',
          hasPassphrase: false,
          hasPin: false,
        },
        { deviceId: '2', name: 'Wallet 2', hasPassphrase: false, hasPin: true },
      ];

      await deleteWallets(mockDb as IDatabase, wallets);

      expect((mockDb as IDatabase).account.remove).toHaveBeenCalledTimes(1);
      expect((mockDb as IDatabase).account.remove).toHaveBeenCalledWith({
        walletId: '1',
      });
      expect((mockDb as IDatabase).wallet.remove).toHaveBeenCalledTimes(1);
      expect((mockDb as IDatabase).wallet.remove).toHaveBeenCalledWith({
        __id: '1',
      });
      expect((mockDb as IDatabase).transaction.remove).toHaveBeenCalledTimes(1);
      expect((mockDb as IDatabase).transaction.remove).toHaveBeenCalledWith({
        walletId: '1',
      });
    });
  });
});
