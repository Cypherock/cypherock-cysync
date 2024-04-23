import { ITransaction } from '@cypherock/db-interfaces';

import { ISolanaAccount, IPreparedSolanaTransaction } from '../../src';

export interface IPrepareTransactionTestCases {
  name: string;
  txn: IPreparedSolanaTransaction;
  output: ITransaction;
  mocks: {
    account: Partial<ISolanaAccount>;
  };
}

export const valid: IPrepareTransactionTestCases[] = [
  {
    name: 'With default values',
    txn: {
      accountId: 'accountId1',
      userInputs: {
        outputs: [
          {
            address: 'CiQQoJBdWgQUVjo4JUemrVMU1BwoMsTFrXZPt69ht33v',
            amount: '100000000',
          },
        ],
        isSendAll: false,
      },
      staticData: {
        fees: '5000',
      },
      computedData: {
        output: {
          address: 'CiQQoJBdWgQUVjo4JUemrVMU1BwoMsTFrXZPt69ht33v',
          amount: '100000000',
        },
        fees: '5000',
      },
      validation: {
        hasEnoughBalance: true,
        outputs: [],
        isValidFee: true,
      },
    },
    mocks: {
      account: {
        assetId: 'solana',
        parentAssetId: 'solana',
        familyId: 'solana',
        walletId: '00000000',
        xpubOrAddress: 'CiQQoJBdWgQUVjo4JUemrVMU1BwoMsTFrXZPt69ht33t',
        __id: 'accountId1',
      },
    },
    output: {
      hash: '5Jq6bneL1ciqug5u9adYsJUZdyhfAoaw7FYk5bQt7PvtCqafs2dwKJ6Z2Dfu828KXM1fFWwfqrrVg68cLBWCw2Ci',
      fees: '5000',
      amount: '100000000',
      status: 'pending',
      type: 'send',
      timestamp: 1691152239897,
      blockHeight: -1,
      inputs: [
        {
          address: 'CiQQoJBdWgQUVjo4JUemrVMU1BwoMsTFrXZPt69ht33t',
          amount: '100000000',
          isMine: true,
        },
      ],
      outputs: [
        {
          address: 'CiQQoJBdWgQUVjo4JUemrVMU1BwoMsTFrXZPt69ht33v',
          amount: '100000000',
          isMine: false,
        },
      ],
      confirmations: 0,
      accountId: 'accountId1',
      walletId: '00000000',
      assetId: 'solana',
      parentAssetId: 'solana',
      familyId: 'solana',
    },
  },
];
