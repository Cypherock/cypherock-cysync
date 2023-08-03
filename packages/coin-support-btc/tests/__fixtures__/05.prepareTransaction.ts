import {
  IBtcAccount,
  IPreparedBtcTransaction,
  IDerivedAddresses,
} from '../../src';

export interface IPrepareTransactionTestCases {
  name: string;
  txn: IPreparedBtcTransaction;
  output: IPreparedBtcTransaction;
  mocks: {
    account: Partial<IBtcAccount>;
    addresses: Partial<IDerivedAddresses>;
  };
}

export const valid: IPrepareTransactionTestCases[] = [
  {
    name: 'With default values',
    txn: {
      accountId: '1',
      userInputs: {
        outputs: [{ address: 'kajshd', amount: '' }],
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
        fee: 0,
        inputs: [],
        outputs: [],
      },
      validation: {
        hasEnoughBalance: true,
        outputs: [],
      },
    },
    mocks: {
      account: {
        assetId: 'litecoin',
        familyId: 'bitcoin',
      },
      addresses: {
        tokens: [
          {
            type: 'XPUBAddress',
            name: 'LLFJKN7dsxc35PKuhn9WxKvaXr82isuKLN',
            path: "m/44'/1'/0'/1/2",
            transfers: 0,
            decimals: 8,
          },
        ],
      },
    },
    output: {
      accountId: '1',
      userInputs: {
        outputs: [{ address: 'kajshd', amount: '' }],
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
            address: 'kajshd',
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
        outputs: [false],
      },
    },
  },
];
