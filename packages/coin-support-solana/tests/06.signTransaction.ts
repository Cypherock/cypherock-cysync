import { IDatabase } from '@cypherock/db-interfaces';
import { IDeviceConnection } from '@cypherock/sdk-interfaces';
import { beforeEach, describe, expect, jest, test } from '@jest/globals';
import * as solanaWeb3 from '@solana/web3.js';
import { Observer } from 'rxjs';

import * as solanaAppMock from './__mocks__/solanaApp';

import { SolanaSupport, ISignSolanaTransactionEvent } from '../src';

const transaction = {
  accountId: '1',
  userInputs: {
    outputs: [
      { address: 'CiQQoJBdWgQUVjo4JUemrVMU1BwoMsTFrXZPt69ht33v', amount: '0' },
    ],
    isSendAll: false,
  },
  staticData: {
    fees: 5000,
  },
  computedData: {
    fees: 5000,
    output: {
      address: 'CiQQoJBdWgQUVjo4JUemrVMU1BwoMsTFrXZPt69ht33v',
      amount: '0',
    },
  },
  validation: {
    hasEnoughBalance: true,
    outputs: [true],
    isValidFee: true,
  },
};

describe('06. Sign Transaction', () => {
  let support: SolanaSupport;
  let connection: IDeviceConnection;
  let db: IDatabase;
  const getOneMock = jest.fn().mockReturnValue({
    walletId: '00000000',
    assetId: 'solana',
    parentAssetId: 'solana',
    familyId: 'solana',
    xpubOrAddress: 'CiQQoJBdWgQUVjo4JUemrVMU1BwoMsTFrXZPt69ht33v',
    derivationPath: "m/44'/501'/0'",
  });
  const signedTransactionFromDevice = 'test';

  beforeEach(() => {
    SolanaSupport.setWeb3Library(solanaWeb3);
    support = new SolanaSupport();
    connection = {} as any;
    db = {
      account: {
        getOne: getOneMock,
      },
    } as any;

    solanaAppMock.create.mockClear();
    solanaAppMock.signTxn.mockClear();
    solanaAppMock.getLatestBlockHash.mockClear();
    solanaAppMock.getLatestBlockHash.mockReturnValue(
      Promise.resolve('6Rmcyocvzr1PW1Me1edJhEzzaVmA1dzfzVjBMf2jFAhY'),
    );
    solanaAppMock.signTxn.mockReturnValue(
      Promise.resolve({
        signature: signedTransactionFromDevice,
        serializedTxn: signedTransactionFromDevice,
        serializedTxnHex: signedTransactionFromDevice,
      }),
    );

    getOneMock.mockClear();
  });

  test('should be able to verify signed transaction', done => {
    let isFlowCompleted = false;
    let signedTransaction = '';

    const observer: Observer<ISignSolanaTransactionEvent> = {
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
