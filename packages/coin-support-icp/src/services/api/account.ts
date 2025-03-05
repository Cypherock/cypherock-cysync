import { getCoinSupportDfinityLib } from '../../utils';

const ICP_LEDGER_CANISTER_ID = 'ryjl3-tyaaa-aaaaa-aaaba-cai';

export const getBalance = async (accountId: string) => {
  try {
    const { agent, icp, principal } = getCoinSupportDfinityLib();
    const ledger = icp.LedgerCanister.create({
      agent: await agent.HttpAgent.create({ host: 'https://icp-api.io' }),
      canisterId: principal.Principal.fromText(ICP_LEDGER_CANISTER_ID),
    });

    const balance = await ledger.accountBalance({
      accountIdentifier: accountId,
    });

    return balance.toString();
  } catch (error) {
    throw new Error('Error fetching ICP account balance');
  }
};
