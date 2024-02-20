import { getStarknetApiJs } from '@cypherock/sdk-app-starknet/dist/utils';

export const getTransactions = async (
  address: string,
  assetId: string,
  from?: number,
  limit?: number,
) => {
  console.log({ address, assetId, from, limit });
  return {
    transactions: {},
    hasMore: false,
  };
};

export const broadcastTransactionToBlockchain = async (
  transaction: string,
  assetId: string,
): Promise<string> => {
  console.log('Broadcasting: ', { transaction, assetId });
  return '1';
};

export const estimateFee = async (
  action: 'deploy' | 'transfer',
  params: {
    from: string;
    to: string;
    value: string;
    data: string;
  },
) => {
  const starknetjs = getStarknetApiJs();
  let resp;
  if (action === 'transfer') {
    resp = { suggestedMaxFee: '0x8110e6d36a8' };
  } else {
    const calldata = starknetjs.CallData.compile([params.from, 0]);
    resp = await starknetjs.defaultProvider.getDeployAccountEstimateFee(
      {
        classHash:
          '0x01a736d6ed154502257f02b1ccdf4d9d1089f80811cd6acad48e6b6a9d1f2003',
        constructorCalldata: calldata,
      },
      {
        nonce: 0,
      },
    );
  }

  console.log({ resp });
  return resp;
};
