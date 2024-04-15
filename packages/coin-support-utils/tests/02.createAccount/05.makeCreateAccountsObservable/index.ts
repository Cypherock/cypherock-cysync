import { ICreateAccountEvent } from '@cypherock/coin-support-interfaces';
import { describe, test } from '@jest/globals';
import { Observer } from 'rxjs';
import { makeCreateAccountsObservable } from '../../../src';
import { createAccountParams } from '../../__mocks__';
import { fixtures } from './__fixtures__';

describe('makeCreateAccountsObservable', () => {
  afterEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  fixtures.valid.forEach(({ name }) => {
    test(name, done => {
      const params = createAccountParams();
      const createAccountsObservable = makeCreateAccountsObservable(params);

      const observer: Observer<ICreateAccountEvent> = {
        next: () => {
          // next actions
        },
        complete: () => {
          expect(true).toBe(true);
          done();
        },
        error: err => {
          throw err;
        },
      };

      createAccountsObservable.subscribe(observer);

      // for (let i = 0; i < 10; i++) {
      // }

      // await new Promise<void>(resolve => {
      //   mockObserver.complete.mockReturnValue(() => resolve());
      //   mockObserver.error.mockReturnValue(() => resolve());
      // });

      // expect(mockObserver.next).toHaveBeenCalledTimes(1);
      // expect(mockObserver.complete).toHaveBeenCalledTimes(1);
      // expect(mockObserver.error).not.toHaveBeenCalled();
    });
  });
});
