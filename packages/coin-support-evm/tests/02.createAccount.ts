import { Observer } from 'rxjs';
import { IDatabase } from '@cypherock/db-interfaces';
import { IDeviceConnection } from '@cypherock/sdk-interfaces';
import { beforeEach, describe, expect, jest, test } from '@jest/globals';
import * as ethers from 'ethers';

import * as evmAppMock from './__mocks__/evmApp';
import * as serviceMock from './__mocks__/services';

import { EvmSupport, ICreateEvmAccountEvent, IEvmAccount } from '../src';

describe('02. Create Account', () => {
  let support: EvmSupport;
  let connection: IDeviceConnection;
  let db: IDatabase;
  const getAllMock = jest.fn().mockReturnValue([]);

  beforeEach(() => {
    EvmSupport.setEthersLibrary(ethers);
    support = new EvmSupport();
    connection = {} as any;
    db = {
      account: {
        getAll: getAllMock,
      },
    } as any;

    evmAppMock.create.mockClear();
    evmAppMock.getPublicKeys.mockClear();

    serviceMock.getBalance.mockClear();
    serviceMock.getTransactionCount.mockClear();

    getAllMock.mockClear();
  });

  test('should be able to create new accounts', done => {
    const accounts: IEvmAccount[] = [];
    let isDeviceDone = false;

    const observer: Observer<ICreateEvmAccountEvent> = {
      next: data => {
        if (data.type === 'Account' && data.account) {
          accounts.push(data.account);
        }
        if (data.type === 'Device' && data.device?.isDone) {
          isDeviceDone = true;
        }
      },
      complete: () => {
        expect(isDeviceDone).toEqual(true);

        expect(accounts).toBeDefined();
        expect(accounts.length).toEqual(3);
        const ledgerAccounts = accounts.filter(
          e => e.derivationScheme === 'ledger',
        );
        const metaMaskAccounts = accounts.filter(
          e => e.derivationScheme === 'metamask',
        );
        const legacyAccounts = accounts.filter(
          e => e.derivationScheme === 'legacy',
        );

        expect(ledgerAccounts.length).toEqual(1);
        expect(ledgerAccounts.map(e => e.derivationPath)).toEqual([
          "m/44'/60'/0'/0/0",
        ]);

        expect(metaMaskAccounts.length).toEqual(1);
        expect(metaMaskAccounts.map(e => e.derivationPath)).toEqual([
          "m/44'/60'/0'/0/1",
        ]);

        expect(legacyAccounts.length).toEqual(1);
        expect(legacyAccounts.map(e => e.derivationPath)).toEqual([
          "m/44'/60'/0'/0",
        ]);
        done();
      },
      error: err => {
        throw err;
      },
    };

    support
      .createAccounts({
        connection,
        db,
        coinId: 'ethereum',
        walletId: '1243',
        waitInMSBetweenEachAccountAPI: 1,
      })
      .subscribe(observer);
  });

  test('should be able to skip existing accounts', done => {
    getAllMock.mockReturnValue([
      { derivationPath: "m/44'/60'/0'/0/0" },
      { derivationPath: "m/44'/60'/0'/0/1" },
      { derivationPath: "m/44'/60'/0'/0" },
    ]);

    const accounts: IEvmAccount[] = [];
    let isDeviceDone = false;

    const observer: Observer<ICreateEvmAccountEvent> = {
      next: data => {
        if (data.type === 'Account' && data.account) {
          accounts.push(data.account);
        }
        if (data.type === 'Device' && data.device?.isDone) {
          isDeviceDone = true;
        }
      },
      complete: () => {
        expect(isDeviceDone).toEqual(true);

        expect(accounts).toBeDefined();
        expect(accounts.length).toEqual(3);
        const ledgerAccounts = accounts.filter(
          e => e.derivationScheme === 'ledger',
        );
        const metaMaskAccounts = accounts.filter(
          e => e.derivationScheme === 'metamask',
        );
        const legacyAccounts = accounts.filter(
          e => e.derivationScheme === 'legacy',
        );

        expect(ledgerAccounts.length).toEqual(1);
        expect(ledgerAccounts.map(e => e.derivationPath)).toEqual([
          "m/44'/60'/1'/0/0",
        ]);

        expect(metaMaskAccounts.length).toEqual(1);
        expect(metaMaskAccounts.map(e => e.derivationPath)).toEqual([
          "m/44'/60'/0'/0/2",
        ]);

        expect(legacyAccounts.length).toEqual(1);
        expect(legacyAccounts.map(e => e.derivationPath)).toEqual([
          "m/44'/60'/0'/1",
        ]);
        done();
      },
      error: err => {
        throw err;
      },
    };

    support
      .createAccounts({
        connection,
        db,
        coinId: 'ethereum',
        walletId: '1243',
        waitInMSBetweenEachAccountAPI: 1,
      })
      .subscribe(observer);
  });
});
