import { getCoinSupportDfinityLib } from '../../utils';

const ICP_LEDGER_CANISTER_ID = 'ryjl3-tyaaa-aaaaa-aaaba-cai';
const HOST = 'https://icp-api.io';

export const getBalance = async (accountId: string) => {
  try {
    const { agent, icp, principal } = getCoinSupportDfinityLib();
    const ledger = icp.LedgerCanister.create({
      agent: await agent.HttpAgent.create({ host: HOST }),
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

export const getTokenBalance = async (
  principalID: Uint8Array,
  tokenLedgerCanisterId: string,
) => {
  try {
    const { agent, icrc, principal } = getCoinSupportDfinityLib();

    const icrcLedger = icrc.IcrcLedgerCanister.create({
      agent: await agent.HttpAgent.create({ host: HOST }),
      canisterId: principal.Principal.from(tokenLedgerCanisterId),
    });

    const balance = await icrcLedger.balance({
      owner: principal.Principal.from(principalID),
    });

    return balance.toString();
  } catch (error) {
    throw new Error('Error fetching ICP token account balance');
  }
};
