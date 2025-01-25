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
        instructions: [],
        computeUnitPriceMicroLamports: 100,
        computeUnits: 150,
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
      computeUnitPriceMicroLamports: 100,
      computeUnits: 150,
    },
  },
];
