import { IDatabase } from '@cypherock/db-interfaces';
import { IDeviceConnection } from '@cypherock/sdk-interfaces';
import { beforeEach, describe, expect, jest, test } from '@jest/globals';
import { Observer } from 'rxjs';

import * as serviceMock from './__mocks__/services';
import * as solanaAppMock from './__mocks__/solanaApp';

import {
  SolanaSupport,
  ICreateSolanaAccountEvent,
  ISolanaAccount,
} from '../src';

describe('02. Create Account', () => {
  let support: SolanaSupport;
  let connection: IDeviceConnection;
  let db: IDatabase;
  const getAllMock = jest.fn().mockReturnValue([]);

  beforeEach(() => {
    support = new SolanaSupport();
    connection = {} as any;
    db = {
      account: {
        getAll: getAllMock,
      },
    } as any;

    solanaAppMock.create.mockClear();
    solanaAppMock.getPublicKeys.mockClear();

    serviceMock.getBalance.mockClear();

    getAllMock.mockClear();
  });

  test('should be able to create new accounts', done => {
    const accounts: ISolanaAccount[] = [];
    let isDeviceDone = false;

    const observer: Observer<ICreateSolanaAccountEvent> = {
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
        const paperAccounts = accounts.filter(
          e => e.derivationScheme === 'paper',
        );
        const ledgerAccounts = accounts.filter(
          e => e.derivationScheme === 'ledger',
        );
        const phantomAccounts = accounts.filter(
          e => e.derivationScheme === 'phantom',
        );

        expect(paperAccounts.length).toEqual(1);
        expect(paperAccounts.map(e => e.derivationPath)).toEqual([
          "m/44'/501'",
        ]);

        expect(ledgerAccounts.length).toEqual(1);
        expect(ledgerAccounts.map(e => e.derivationPath)).toEqual([
          "m/44'/501'/0'",
        ]);

        expect(phantomAccounts.length).toEqual(1);
        expect(phantomAccounts.map(e => e.derivationPath)).toEqual([
          "m/44'/501'/0'/0'",
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
        coinId: 'solana',
        walletId: '1243',
        waitInMSBetweenEachAccountAPI: 1,
      })
      .subscribe(observer);
  });

  test('should be able to skip existing accounts', done => {
    getAllMock.mockReturnValue([
      { derivationPath: "m/44'/501'" },
      { derivationPath: "m/44'/501'/0'" },
      { derivationPath: "m/44'/501'/0'/0'" },
    ]);

    const accounts: ISolanaAccount[] = [];
    let isDeviceDone = false;

    const observer: Observer<ICreateSolanaAccountEvent> = {
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
        expect(accounts.length).toEqual(2);
        const paperAccounts = accounts.filter(
          e => e.derivationScheme === 'paper',
        );
        const ledgerAccounts = accounts.filter(
          e => e.derivationScheme === 'ledger',
        );
        const phantomAccounts = accounts.filter(
          e => e.derivationScheme === 'phantom',
        );

        expect(paperAccounts.length).toEqual(0);

        expect(ledgerAccounts.length).toEqual(1);
        expect(ledgerAccounts.map(e => e.derivationPath)).toEqual([
          "m/44'/501'/1'",
        ]);

        expect(phantomAccounts.length).toEqual(1);
        expect(phantomAccounts.map(e => e.derivationPath)).toEqual([
          "m/44'/501'/1'/0'",
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
        coinId: 'solana',
        walletId: '1243',
        waitInMSBetweenEachAccountAPI: 1,
      })
      .subscribe(observer);
  });
});
