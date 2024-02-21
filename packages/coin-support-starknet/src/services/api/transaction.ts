import { getStarknetApiJs } from '@cypherock/sdk-app-starknet/dist/utils';
import {
  IPreparedStarknetTransaction,
  IStarknetAccount,
} from '../../operations/types';
import logger from '../../utils/logger';
import { config } from '../../config';
import { BigNumber } from '@cypherock/cysync-utils';

const contractAXclassHash =
  '0x01a736d6ed154502257f02b1ccdf4d9d1089f80811cd6acad48e6b6a9d1f2003';

const nodeUrl = `https://starknet-goerli.infura.io/v3/${config.INFURA_STARKNET_API_KEY}`;
let provider: any = null;

export const getTransactions = async (
  address: string,
  assetId: string,
  from?: number,
  limit?: number,
) => {
  logger.verbose({ address, assetId, from, limit });
  console.log('\nTransaction history not implemented\n');
  return {
    transactions: {},
    hasMore: false,
  };
};

export const broadcastTransactionToBlockchain = async (
  transaction: IPreparedStarknetTransaction,
  account: IStarknetAccount,
  signature: string,
): Promise<string> => {
  const staknetjs = getStarknetApiJs();
  const constructorAXCallData = staknetjs.CallData.compile([
    account.extraData.salt ?? '0x00',
    0,
  ]);
  let txn: any = {};
  if (!provider) {
    provider = new (getStarknetApiJs().RpcProvider)({ nodeUrl });
  }

  if (transaction.userInputs.txnType === 'deploy') {
    txn = await provider.deployAccountContract(
      {
        classHash: contractAXclassHash,
        addressSalt: account.extraData.salt ?? '0x00',
        constructorCalldata: constructorAXCallData,
        signature: [
          `0x${signature.slice(0, 64)}`,
          `0x${signature.slice(64, 128)}`,
        ],
      },
      {
        nonce: 0,
        version: 1,
        maxFee: new BigNumber(transaction.computedData.maxFee, 16).toNumber(),
      },
    );
    console.log({ BroadcastedTransaction: txn });
  } else {
    // TODO: add broadcast of other transaction types
  }

  if (!txn.transaction_hash) {
    throw new Error('Broadcast error. Transaction hash undefined.');
  }
  return txn.transaction_hash;
};

export const estimateFee = async (action: 'deploy' | 'transfer') => {
  let resp;
  if (action === 'transfer') {
    resp = { suggestedMaxFee: '0x8110e6d36a8' };
  } else {
    resp = { suggestedMaxFee: '0x8110e6d36a8' };
  }

  return resp;
};
