import { IBtcAccount, IPreparedBtcTransaction, IUtxo } from '../../src';

export interface IInitializeTransactionTestCases {
  name: string;
  txn: IPreparedBtcTransaction;
  mocks: {
    account: Partial<IBtcAccount>;
    averageFee: number;
    utxos: IUtxo[];
  };
}

export const valid: IInitializeTransactionTestCases[] = [
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
        isSendAll: false,
      },
      validation: {
        hasEnoughBalance: true,
        outputs: [],
        isValidFee: true,
        isNotOverDustThreshold: false,
      },
    },
    mocks: {
      account: {
        assetId: 'bitcoin',
        parentAssetId: 'bitcoin',
        familyId: 'bitcoin',
      },
      averageFee: 150,
      utxos: [],
    },
  },
];
