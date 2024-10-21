import { ICreateAccountEvent } from '@cypherock/coin-support-interfaces';
import { describe, test } from '@jest/globals';
import { Observer, Subscription } from 'rxjs';
import { makeCreateAccountsObservable } from '../../../src';
import {
  createAccountParams,
  createAppMock,
  db,
  getAddressesFromDeviceImplementation,
  getAddressesFromDeviceMock,
  testApp,
} from '../../__mocks__';

/**
 * @todo Increase branch coverage
 */
describe('makeCreateAccountsObservable', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  beforeEach(() => {
    jest.restoreAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('should create new accounts', done => {
    db.account.getAll.mockResolvedValue([]);

    const waitInMSBetweenEachAccountAPI: number | undefined = 250;

    const params = createAccountParams(db, waitInMSBetweenEachAccountAPI);
    const createAccountsObservable = makeCreateAccountsObservable(params);

    const derivationSchemeCount = Object.values(
      params.derivationPathSchemes,
    ).filter(Boolean).length;

    const totalNewAccountLimit = Object.values(
      params.derivationPathSchemes,
    ).reduce((acc, scheme) => acc + (scheme?.newAccountLimit ?? 0), 0);

    const newAccountsCount = Math.min(
      totalNewAccountLimit,
      Math.floor(params.derivationPathLimit / derivationSchemeCount) *
        derivationSchemeCount,
    );

    expect.assertions(newAccountsCount + 5);

    const observer: Observer<ICreateAccountEvent> = {
      next: value => {
        if (value.type === 'Account') {
          expect(value.account).toBeDefined();
        }
      },
      complete: () => {
        expect(db.account.getAll).toHaveBeenCalledTimes(1);
        expect(params.createApp).toHaveBeenCalledTimes(1);
        expect(params.getAddressesFromDevice).toHaveBeenCalledTimes(1);
        expect(params.getBalanceAndTxnCount).toHaveBeenCalledTimes(
          newAccountsCount,
        );
        expect(params.createAccountFromAddress).toHaveBeenCalledTimes(
          newAccountsCount,
        );
        done();
      },
      error: done,
    };

    createAccountsObservable.subscribe(observer);

    for (let i = 0; i < newAccountsCount; i += 1) {
      jest.advanceTimersByTimeAsync(waitInMSBetweenEachAccountAPI ?? 500);
    }
  });

  test('should unsubscribe after creating app', done => {
    let subscription: Subscription | undefined;
    db.account.getAll.mockResolvedValue([]);

    const waitInMSBetweenEachAccountAPI: number | undefined = 250;

    const params = createAccountParams(db, waitInMSBetweenEachAccountAPI);

    createAppMock.mockImplementation(async () => {
      subscription?.unsubscribe();
      return testApp;
    });

    const createAccountsObservable = makeCreateAccountsObservable(params);

    const derivationSchemeCount = Object.values(
      params.derivationPathSchemes,
    ).filter(Boolean).length;

    const totalNewAccountLimit = Object.values(
      params.derivationPathSchemes,
    ).reduce((acc, scheme) => acc + (scheme?.newAccountLimit ?? 0), 0);

    const newAccountsCount = Math.min(
      totalNewAccountLimit,
      Math.floor(params.derivationPathLimit / derivationSchemeCount) *
        derivationSchemeCount,
    );

    expect.assertions(5);

    const observer: Observer<ICreateAccountEvent> = {
      next: () => {
        // shouldn't reach here
        expect(true).toBe(false);
      },
      complete: () => {
        // shouldn't reach here
        expect(true).toBe(false);
      },
      error: () => {
        // shouldn't reach here
        expect(true).toBe(false);
      },
    };

    subscription = createAccountsObservable.subscribe(observer);

    setTimeout(() => {
      expect(db.account.getAll).toHaveBeenCalledTimes(1);
      expect(params.createApp).toHaveBeenCalledTimes(1);
      expect(params.getAddressesFromDevice).toHaveBeenCalledTimes(0);
      expect(params.getBalanceAndTxnCount).toHaveBeenCalledTimes(0);
      expect(params.createAccountFromAddress).toHaveBeenCalledTimes(0);
      done();
    }, 0);

    for (let i = 0; i < newAccountsCount; i += 1) {
      jest.advanceTimersByTimeAsync(waitInMSBetweenEachAccountAPI ?? 500);
    }
  });

  test('should unsubscribe after generating address from device', done => {
    let subscription: Subscription | undefined;
    db.account.getAll.mockResolvedValue([]);

    const waitInMSBetweenEachAccountAPI: number | undefined = 250;

    const params = createAccountParams(db, waitInMSBetweenEachAccountAPI);

    getAddressesFromDeviceMock.mockImplementation(async (...args) => {
      subscription?.unsubscribe();
      return getAddressesFromDeviceImplementation(...args);
    });

    const createAccountsObservable = makeCreateAccountsObservable(params);

    const derivationSchemeCount = Object.values(
      params.derivationPathSchemes,
    ).filter(Boolean).length;

    const totalNewAccountLimit = Object.values(
      params.derivationPathSchemes,
    ).reduce((acc, scheme) => acc + (scheme?.newAccountLimit ?? 0), 0);

    const newAccountsCount = Math.min(
      totalNewAccountLimit,
      Math.floor(params.derivationPathLimit / derivationSchemeCount) *
        derivationSchemeCount,
    );

    expect.assertions(5);

    const observer: Observer<ICreateAccountEvent> = {
      next: () => {
        // shouldn't reach here
        expect(true).toBe(false);
      },
      complete: () => {
        // shouldn't reach here
        expect(true).toBe(false);
      },
      error: () => {
        // shouldn't reach here
        expect(true).toBe(false);
      },
    };

    subscription = createAccountsObservable.subscribe(observer);

    setTimeout(() => {
      expect(db.account.getAll).toHaveBeenCalledTimes(1);
      expect(params.createApp).toHaveBeenCalledTimes(1);
      expect(params.getAddressesFromDevice).toHaveBeenCalledTimes(1);
      expect(params.getBalanceAndTxnCount).toHaveBeenCalledTimes(0);
      expect(params.createAccountFromAddress).toHaveBeenCalledTimes(0);
      done();
    }, 0);

    for (let i = 0; i < newAccountsCount; i += 1) {
      jest.advanceTimersByTimeAsync(waitInMSBetweenEachAccountAPI ?? 500);
    }
  });
});
