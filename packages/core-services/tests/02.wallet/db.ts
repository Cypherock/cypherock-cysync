import { IDatabase } from '@cypherock/db-interfaces';
import { mockDb } from '../__mocks__/mocks';
import { insertWallets, updateWallets, deleteWallets } from '../../src';
import { walletTestData } from '../__fixtures__/db';

describe('Wallet Operations', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('insertWallets', () => {
    walletTestData.insertWallets.valid.forEach((testCase, index) => {
      test(`should insert wallets into the database - test case ${
        index + 1
      }`, async () => {
        await insertWallets(mockDb as IDatabase, testCase);
        expect((mockDb as IDatabase).wallet.insert).toHaveBeenCalledWith(
          testCase,
        );
      });
    });

    walletTestData.insertWallets.invalid.forEach((testCase, index) => {
      test(`should not insert wallets if the array is empty - test case ${
        index + 1
      }`, async () => {
        await insertWallets(mockDb as IDatabase, testCase);
        expect((mockDb as IDatabase).wallet.insert).not.toHaveBeenCalled();
      });
    });
  });

  describe('updateWallets', () => {
    walletTestData.updateWallets.valid.forEach((testCase, index) => {
      test(`should update wallets in the database - test case ${
        index + 1
      }`, async () => {
        await updateWallets(mockDb as IDatabase, testCase);

        expect((mockDb as IDatabase).wallet.update).toHaveBeenCalledTimes(
          testCase.length,
        );
        testCase.forEach(wallet => {
          expect((mockDb as IDatabase).wallet.update).toHaveBeenCalledWith(
            { __id: wallet.__id },
            wallet,
          );
        });
      });
    });

    walletTestData.updateWallets.invalid.forEach((testCase, index) => {
      test(`should skip wallets without an __id - test case ${
        index + 1
      }`, async () => {
        await updateWallets(mockDb as IDatabase, testCase);

        const validWallets = testCase.filter(wallet => wallet.__id);
        expect((mockDb as IDatabase).wallet.update).toHaveBeenCalledTimes(
          validWallets.length,
        );
        validWallets.forEach(wallet => {
          expect((mockDb as IDatabase).wallet.update).toHaveBeenCalledWith(
            { __id: wallet.__id },
            wallet,
          );
        });
      });
    });
  });

  describe('deleteWallets', () => {
    walletTestData.deleteWallets.valid.forEach((testCase, index) => {
      test(`should delete wallets from the database - test case ${
        index + 1
      }`, async () => {
        await deleteWallets(mockDb as IDatabase, testCase);

        testCase.forEach(wallet => {
          expect((mockDb as IDatabase).account.remove).toHaveBeenCalledWith({
            walletId: wallet.__id,
          });
          expect((mockDb as IDatabase).wallet.remove).toHaveBeenCalledWith({
            __id: wallet.__id,
          });
          expect((mockDb as IDatabase).transaction.remove).toHaveBeenCalledWith(
            {
              walletId: wallet.__id,
            },
          );
        });
      });
    });

    walletTestData.deleteWallets.invalid.forEach((testCase, index) => {
      test(`should skip wallets without an __id - test case ${
        index + 1
      }`, async () => {
        await deleteWallets(mockDb as IDatabase, testCase);

        const validWallets = testCase.filter(wallet => wallet.__id);
        expect((mockDb as IDatabase).account.remove).toHaveBeenCalledTimes(
          validWallets.length,
        );
        expect((mockDb as IDatabase).wallet.remove).toHaveBeenCalledTimes(
          validWallets.length,
        );
        expect((mockDb as IDatabase).transaction.remove).toHaveBeenCalledTimes(
          validWallets.length,
        );

        validWallets.forEach(wallet => {
          expect((mockDb as IDatabase).account.remove).toHaveBeenCalledWith({
            walletId: wallet.__id,
          });
          expect((mockDb as IDatabase).wallet.remove).toHaveBeenCalledWith({
            __id: wallet.__id,
          });
          expect((mockDb as IDatabase).transaction.remove).toHaveBeenCalledWith(
            {
              walletId: wallet.__id,
            },
          );
        });
      });
    });
  });
});
