import { beforeEach, describe, expect, jest, test } from '@jest/globals';

import * as testData from './__fixtures__/07.broadcastTransaction';
import * as serviceMock from './__mocks__/services';

import { BtcSupport } from '../src';
import lodash from 'lodash';

describe('07. Broadcast Transaction', () => {
  let support: BtcSupport;
  const getOneTransactionMock = jest
    .fn()
    .mockReturnValue(Promise.resolve(undefined));
  const insertTransactionMock = jest
    .fn()
    .mockReturnValue(Promise.resolve(undefined));

  beforeEach(() => {
    support = new BtcSupport();

    getOneTransactionMock.mockClear();
    insertTransactionMock.mockClear();

    serviceMock.broadcastTransactionToBlockchain.mockClear();
  });

  describe('should be able to broadcast transaction', () => {
    testData.valid.forEach(testCase => {
      test(testCase.name, async () => {
        const getOneAccountMock = jest
          .fn()
          .mockReturnValue(testCase.mocks.account);
        const db = {
          account: {
            getOne: getOneAccountMock,
          },
          transaction: {
            getOne: getOneTransactionMock,
            insert: insertTransactionMock,
          },
        } as any;
        serviceMock.broadcastTransactionToBlockchain.mockReturnValue(
          Promise.resolve(testCase.output.hash),
        );
        serviceMock.getDerivedAddresses.mockReturnValue(
          Promise.resolve(testCase.mocks.addresses),
        );
        global.Date.now = jest.fn(() => testCase.output.timestamp);

        const preparedTransaction = await support.broadcastTransaction({
          db,
          transaction: testCase.txn,
          signedTransaction: '',
        });

        expect(preparedTransaction).toBeDefined();
        expect(insertTransactionMock.mock.calls.length).toEqual(1);
        expect(
          insertTransactionMock.mock.calls[0].map((t: any) =>
            lodash.omit(t, ['__id']),
          ),
        ).toEqual([preparedTransaction]);
        expect(preparedTransaction).toEqual(testCase.output);
      });
    });
  });
});
