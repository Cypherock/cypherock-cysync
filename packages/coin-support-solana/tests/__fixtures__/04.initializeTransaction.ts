import { ISolanaAccount, IPreparedSolanaTransaction } from '../../src';

export interface IInitializeTransactionTestCases {
  name: string;
  txn: IPreparedSolanaTransaction;
  mocks: {
    account: Partial<ISolanaAccount>;
    fees: string;
  };
}

export const valid: IInitializeTransactionTestCases[] = [
  {
    name: 'With default values',
    txn: {
      accountId: '1',
      validation: {
        outputs: [],
        hasEnoughBalance: true,
        isValidFee: true,
      },
      userInputs: {
        outputs: [],
        isSendAll: false,
      },
      staticData: {
        fees: '5000',
      },
      computedData: {
        output: { address: '', amount: '0' },
        fees: '5000',
      },
    },
    mocks: {
      account: {
        assetId: 'solana',
        parentAssetId: 'solana',
        familyId: 'solana',
      },
      fees: '5000',
    },
  },
];
