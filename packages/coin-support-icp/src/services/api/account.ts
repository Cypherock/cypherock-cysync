import { HttpAgent } from '@dfinity/agent';
import { LedgerCanister } from '@dfinity/ledger-icp';
import { Principal } from '@dfinity/principal';

const ICP_LEDGER_CANISTER_ID = 'ryjl3-tyaaa-aaaaa-aaaba-cai';

export const getBalance = async (accountId: string) => {
  try {
    const agent = await HttpAgent.create({ host: 'https://icp-api.io' });

    const ledger = LedgerCanister.create({
      agent,
      canisterId: Principal.fromText(ICP_LEDGER_CANISTER_ID),
    });

    const balance = await ledger.accountBalance({
      accountIdentifier: accountId,
    });

    return balance.toString();
  } catch (error) {
    throw new Error('Error fetching ICP account balance');
  }
};

export const getTransactionsCount = async (
  accountId: string,
  assetId: string,
) => {
  console.log({ accountId, assetId });
  return Promise.resolve(1);
};
