import { ISolanaAccount, IPreparedSolanaTransaction } from '../../src';

export interface IPrepareTransactionTestCases {
  name: string;
  txn: IPreparedSolanaTransaction;
  output: IPreparedSolanaTransaction;
  mocks: {
    account: Partial<ISolanaAccount>;
  };
}

export const valid: IPrepareTransactionTestCases[] = [
  {
    name: 'With default values',
    txn: {
      accountId: '1',
      userInputs: {
        outputs: [{ address: 'address', amount: '0' }],
        isSendAll: false,
      },
      staticData: {
        fees: '5000',
      },
      computedData: {
        output: { address: 'address', amount: '0' },
        fees: '5000',
        instructions: [],
        computeUnitPriceMicroLamports: 100,
        computeUnits: 150,
      },
      validation: {
        hasEnoughBalance: true,
        outputs: [],
        isValidFee: true,
        ownOutputAddressNotAllowed: [],
        zeroAmountNotAllowed: false,
        isRentExemptFeeRequired: false,
      },
    },
    mocks: {
      account: {
        assetId: 'solana',
        parentAssetId: 'solana',
        familyId: 'solana',
      },
    },
    output: {
      accountId: '1',
      userInputs: {
        outputs: [{ address: 'address', amount: '0' }],
        isSendAll: false,
      },
      staticData: {
        fees: '5000',
      },
      computedData: {
        fees: '5000',
        output: {
          address: 'address',
          amount: '0',
        },
        instructions: [],
        computeUnitPriceMicroLamports: 100,
        computeUnits: 150,
      },
      validation: {
        hasEnoughBalance: false,
        outputs: [false],
        isValidFee: true,
        ownOutputAddressNotAllowed: [],
        zeroAmountNotAllowed: false,
        isRentExemptFeeRequired: false,
      },
    },
  },
];
