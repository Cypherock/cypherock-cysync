import { IDatabase } from '@cypherock/db-interfaces';
import { IDeviceConnection } from '@cypherock/sdk-interfaces';
import { beforeEach, describe, expect, jest, test } from '@jest/globals';
import { Observer } from 'rxjs';

import * as btcAppMock from './__mocks__/btcApp';

import { BtcSupport, ISignBtcTransactionEvent } from '../src';

const transaction = {
  accountId: '1',
  userInputs: {
    outputs: [{ address: 'LPMmBEMdTVpoNYDKooGWjkFyQ2YduGZpyA', amount: '' }],
    feeRate: 150,
    isSendAll: false,
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
    isValidFee: true,
  },
};

describe('06. Sign Transaction', () => {
  let support: BtcSupport;
  let connection: IDeviceConnection;
  let db: IDatabase;
  const getOneMock = jest.fn().mockReturnValue({
    walletId: '00000000',
    assetId: 'litecoin',
    parentAssetId: 'litecoin',
    familyId: 'bitcoin',
    xpubOrAddress: 'xpub1234',
    derivationPath: "m/44'/2'/0'",
  });
  const signedTransactionFromDevice = 'test';

  beforeEach(() => {
    support = new BtcSupport();
    connection = {} as any;
    db = {
      account: {
        getOne: getOneMock,
      },
    } as any;

    btcAppMock.create.mockClear();
    btcAppMock.signTxn.mockClear();
    btcAppMock.signTxn.mockReturnValue(
      Promise.resolve({
        signatures: [signedTransactionFromDevice],
        signedTransaction: signedTransactionFromDevice,
      }),
    );

    getOneMock.mockClear();
  });

  test('should be able to verify receive address', done => {
    let isFlowCompleted = false;
    let signedTransaction = '';

    const observer: Observer<ISignBtcTransactionEvent> = {
      next: data => {
        if (data.type === 'Transaction' && data.transaction) {
          signedTransaction = data.transaction;
        }

        if (data.type === 'Device' && data.device?.isDone) {
          isFlowCompleted = true;
        }
      },
      complete: () => {
        expect(isFlowCompleted).toEqual(true);

        expect(signedTransaction).toEqual(signedTransactionFromDevice);

        done();
      },
      error: err => {
        throw err;
      },
    };

    support
      .signTransaction({
        connection,
        db,
        transaction,
      })
      .subscribe(observer);
  });
});
