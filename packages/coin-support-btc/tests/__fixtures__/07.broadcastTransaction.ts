import { ITransaction } from '@cypherock/db-interfaces';
import {
  IBtcAccount,
  IPreparedBtcTransaction,
  IDerivedAddresses,
} from '../../src';

export interface IPrepareTransactionTestCases {
  name: string;
  txn: IPreparedBtcTransaction;
  output: ITransaction;
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
        outputs: [
          { address: 'LPMmBEMdTVpoNYDKooGWjkFyQ2YduGZpyA', amount: '10000' },
        ],
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
            value: 10000,
          },
          {
            address: 'LLFJKN7dsxc35PKuhn9WxKvaXr82isuKLN',
            derivationPath: "m/44'/1'/0'/1/2",
            value: 49798984,
          },
        ],
      },
      validation: {
        hasEnoughBalance: true,
        outputs: [true],
        isValidFee: true,
        isNotOverDustThreshold: false,
      },
    },
    mocks: {
      account: {
        __id: 'accountId1',
        walletId: '00000000',
        assetId: 'litecoin',
        parentAssetId: 'litecoin',
        familyId: 'bitcoin',
        xpubOrAddress: 'xpub1234',
        derivationPath: "m/44'/2'/0'",
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
          {
            type: 'XPUBAddress',
            name: 'LYzVffwKeuwnqeuwVikH59gk3iLvVaeZUN',
            path: "m/44'/2'/0'/0/0",
            transfers: 2,
            decimals: 8,
          },
        ],
      },
    },
    output: {
      hash: '812736981263167236',
      fees: '33900',
      amount: '10000',
      status: 'pending',
      type: 'send',
      timestamp: 1691152239897,
      blockHeight: -1,
      inputs: [
        {
          address: 'LYzVffwKeuwnqeuwVikH59gk3iLvVaeZUN',
          amount: '49842884',
          isMine: true,
        },
      ],
      outputs: [
        {
          address: 'LPMmBEMdTVpoNYDKooGWjkFyQ2YduGZpyA',
          amount: '10000',
          isMine: false,
        },
        {
          address: 'LLFJKN7dsxc35PKuhn9WxKvaXr82isuKLN',
          amount: '49798984',
          isMine: true,
        },
      ],
      confirmations: 0,
      accountId: 'accountId1',
      walletId: '00000000',
      assetId: 'litecoin',
      parentAssetId: 'litecoin',
      familyId: 'bitcoin',
    },
  },
];
