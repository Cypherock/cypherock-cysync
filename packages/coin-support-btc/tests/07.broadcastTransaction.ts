import { beforeEach, describe, expect, jest, test } from '@jest/globals';

import * as testData from './__fixtures__/07.broadcastTransaction';
import * as serviceMock from './__mocks__/services';

import { BtcSupport } from '../src';

const transaction = {
  accountId: '1',
  userInputs: {
    outputs: [{ address: 'LPMmBEMdTVpoNYDKooGWjkFyQ2YduGZpyA', amount: '' }],
    feeRate: 150,
  },
  staticData: {
    averageFee: 150,
    utxos: [
      {
        txid: '8b1720b139daa3231455348806a6d01f53bd6cb31f6068b4b206fc5a8bf46aba',
        vout: 0,
        value: '49842884',
        height: 2479258,
        confirmations: 40652,
        address: 'LYzVffwKeuwnqeuwVikH59gk3iLvVaeZUN',
        path: "m/44'/2'/0'/0/0",
      },
    ],
  },
  computedData: {
    fee: 33900,
    inputs: [
      {
        address: 'LYzVffwKeuwnqeuwVikH59gk3iLvVaeZUN',
        block_height: 2479258,
        confirmations: 40652,
        txId: '8b1720b139daa3231455348806a6d01f53bd6cb31f6068b4b206fc5a8bf46aba',
        value: 49842884,
        vout: 0,
        derivationPath: "m/44'/2'/0'/0/0",
      },
    ],
    outputs: [
      {
        address: 'LPMmBEMdTVpoNYDKooGWjkFyQ2YduGZpyA',
        value: 0,
      },
      {
        address: 'LLFJKN7dsxc35PKuhn9WxKvaXr82isuKLN',
        derivationPath: "m/44'/1'/0'/1/2",
        value: 49808984,
      },
    ],
  },
  validation: {
    hasEnoughBalance: true,
    outputs: [true],
  },
};

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
        global.Date.now = jest.fn(() => testCase.output.timestamp);

        const preparedTransaction = await support.broadcastTransaction({
          db,
          transaction,
          signedTransaction: '',
        });

        expect(preparedTransaction).toBeDefined();
        expect(insertTransactionMock.mock.calls.length).toEqual(1);
        expect(insertTransactionMock.mock.calls[0]).toEqual([
          preparedTransaction,
        ]);
        expect(preparedTransaction).toEqual(testCase.output);
      });
    });
  });
});
