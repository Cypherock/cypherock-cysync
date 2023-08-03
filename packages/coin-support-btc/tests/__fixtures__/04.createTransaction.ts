import { IBtcAccount, IPreparedBtcTransaction, IUtxo } from '../../src';

export interface ICreateTransactionTestCases {
  name: string;
  txn: IPreparedBtcTransaction;
  mocks: {
    account: Partial<IBtcAccount>;
    averageFee: number;
    utxos: IUtxo[];
  };
}

export const valid: ICreateTransactionTestCases[] = [
  {
    name: 'With default values',
    txn: {
      accountId: '1',
      computedData: {
        fee: 0,
        inputs: [],
        outputs: [],
      },
      staticData: {
        averageFee: 150,
        utxos: [],
      },
      userInputs: {
        feeRate: 150,
        outputs: [],
      },
      validation: {
        hasEnoughBalance: true,
        outputs: [],
      },
    },
    mocks: {
      account: {
        assetId: 'bitcoin',
        familyId: 'bitcoin',
      },
      averageFee: 150,
      utxos: [],
    },
  },
];
