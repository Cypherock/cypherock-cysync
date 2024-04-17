import { ICreateAccountEvent } from '@cypherock/coin-support-interfaces';
import { describe, test } from '@jest/globals';
import { Observer } from 'rxjs';
import { makeCreateAccountsObservable } from '../../../src';
import { createAccountParams, db } from '../../__mocks__';
import { fixtures } from './__fixtures__';

describe('makeCreateAccountsObservable', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  fixtures.valid.forEach(({ name }) => {
    test(name, done => {
      // mocks
      db.account.getAll.mockResolvedValue([]);

      const waitInMSBetweenEachAccountAPI: number | undefined = 250;

      const params = createAccountParams(db, waitInMSBetweenEachAccountAPI);
      const createAccountsObservable = makeCreateAccountsObservable(params);

      const derivationSchemeCount = Object.values(
        params.derivationPathSchemes,
      ).filter(Boolean).length;

      const totalThreshold = Object.values(params.derivationPathSchemes).reduce(
        (acc, scheme) => acc + (scheme?.threshold ?? 0),
        0,
      );

      const newAccountsCount = Math.min(
        totalThreshold,
        Math.floor(params.derivationPathLimit / derivationSchemeCount) *
          derivationSchemeCount,
      );

      // expect.assertions(newAccountsCount + 6)

      const observer: Observer<ICreateAccountEvent> = {
        next: value => {
          console.log(value);
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
  });
});
