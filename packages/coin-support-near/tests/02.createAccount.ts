import { Observer } from 'rxjs';
import { IDatabase } from '@cypherock/db-interfaces';
import { IDeviceConnection } from '@cypherock/sdk-interfaces';
import { beforeEach, describe, expect, jest, test } from '@jest/globals';
import * as nearAppMock from './__mocks__/nearApp';
import * as serviceMock from './__mocks__/services';
import { NearSupport, ICreateNearAccountEvent, INearAccount } from '../src';

describe('02. Create Account', () => {
  let support: NearSupport;
  let connection: IDeviceConnection;
  let db: IDatabase;
  const getAllMock = jest.fn().mockReturnValue([]);

  beforeEach(() => {
    support = new NearSupport();
    connection = {} as any;
    db = {
      account: {
        getAll: getAllMock,
      },
    } as any;

    nearAppMock.create.mockClear();
    nearAppMock.getPublicKeys.mockClear();

    serviceMock.getBalance.mockClear();
    serviceMock.getTransactionCount.mockClear();

    getAllMock.mockClear();
  });

  test('should be able to create new accounts', done => {
    const accounts: INearAccount[] = [];
    let isDeviceDone = false;

    const observer: Observer<ICreateNearAccountEvent> = {
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
        expect(accounts.length).toEqual(1);
        const defaultAccounts = accounts.filter(
          e => e.derivationScheme === 'default',
        );

        expect(defaultAccounts.length).toEqual(1);
        expect(defaultAccounts.map(e => e.derivationPath)).toEqual([
          "m/44'/397'/0'/0'/0'",
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
        coinId: 'near',
        walletId: '1243',
        waitInMSBetweenEachAccountAPI: 1,
      })
      .subscribe(observer);
  });

  test('should be able to skip existing accounts', done => {
    getAllMock.mockReturnValue([
      { derivationPath: "m/44'/397'/0'/0'/0'" },
      { derivationPath: "m/44'/397'/0'/0'/2'" },
    ]);

    const accounts: INearAccount[] = [];
    let isDeviceDone = false;

    const observer: Observer<ICreateNearAccountEvent> = {
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
        expect(accounts.length).toEqual(1);
        const defaultAccounts = accounts.filter(
          e => e.derivationScheme === 'default',
        );

        expect(defaultAccounts.length).toEqual(1);
        expect(defaultAccounts.map(e => e.derivationPath)).toEqual([
          "m/44'/397'/0'/0'/1'",
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
        coinId: 'near',
        walletId: '1243',
        waitInMSBetweenEachAccountAPI: 1,
      })
      .subscribe(observer);
  });
});
