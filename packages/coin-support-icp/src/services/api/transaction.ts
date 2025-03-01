import { HttpAgent } from '@dfinity/agent';
import { IndexCanister } from '@dfinity/ledger-icp';

export const getTransactions = async (
  accountId: string,
  limit: bigint,
  start?: bigint,
) => {
  try {
    const agent = await HttpAgent.create({ host: 'https://icp-api.io' });
    const index = IndexCanister.create({ agent });

    const response = await index.getTransactions({
      accountIdentifier: accountId,
      maxResults: limit,
      start,
    });

    return response.transactions;
  } catch (err) {
    throw new Error('Error fetching ICP account transaction history');
  }
};
