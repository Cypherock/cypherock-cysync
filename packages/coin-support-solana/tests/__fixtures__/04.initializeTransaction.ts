import { ISolanaAccount, IPreparedSolanaTransaction } from '../../src';

export interface IInitializeTransactionTestCases {
  name: string;
  txn: IPreparedSolanaTransaction;
  mocks: {
    account: Partial<ISolanaAccount>;
    fees: string;
    computeUnitPriceMicroLamports: number;
    computeUnits: number;
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
        ownOutputAddressNotAllowed: [],
        zeroAmountNotAllowed: false,
        isRentExemptFeeRequired: false,
        isAmountBelowRentExempt: false,
      },
      userInputs: {
        outputs: [],
        isSendAll: false,
      },
      staticData: {
        baseFee: '5000',
        rentExempt: '890880',
      },
      computedData: {
        output: { address: '', amount: '0' },
        fees: '6000',
        instructions: [],
        computeUnitPriceMicroLamports: 100_000,
        computeUnits: 10_000,
      },
    },
    mocks: {
      account: {
        assetId: 'solana',
        parentAssetId: 'solana',
        familyId: 'solana',
        xpubOrAddress: 'CnHNArLuS9r9iSLq2iYdPeWdvg2B5GH8dAGJrJmVrVph',
      },
      fees: '5000',
      computeUnitPriceMicroLamports: 100_000,
      computeUnits: 10_000,
    },
  },
];
