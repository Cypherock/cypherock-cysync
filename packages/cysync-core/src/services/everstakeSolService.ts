import { solanaCoinList } from '@cypherock/coins';
import axios from 'axios';

import { config } from '~/config';

const BASE = `${config.API_CYPHEROCK}/everstake/sol`;
const SOLANA_TXN_BASE = `${config.API_CYPHEROCK}/solana/transaction`;
const STAKE_ACCOUNT_DATA_LENGTH = 200;

export interface IEverstakeSolTxParams {
  unsignedTxHex: string;
}

export interface IEverstakeSolStakeAccount {
  address: string;
  lamports: string;
  stakeLamports: string;
}

export interface IEverstakeSolPositionState {
  lamports: string;
  stakeLamports: string;
  accountCount: number;
  accounts: IEverstakeSolStakeAccount[];
}

export interface IEverstakeSolPosition {
  active: IEverstakeSolPositionState;
  activating: IEverstakeSolPositionState;
  deactivating: IEverstakeSolPositionState;
  deactivated: IEverstakeSolPositionState;
  inactive: IEverstakeSolPositionState;
}

export const getUserPosition = async (
  walletAddress: string,
): Promise<IEverstakeSolPosition> => {
  const res = await axios.get(`${BASE}/position`, {
    params: { walletAddress },
  });
  return res.data.data;
};

export const buildStake = async (
  walletAddress: string,
  amount: string,
): Promise<IEverstakeSolTxParams> => {
  const res = await axios.post(`${BASE}/build/stake`, {
    walletAddress,
    amount,
  });
  return res.data.data;
};

export const buildUnstake = async (
  walletAddress: string,
  amount: string,
): Promise<IEverstakeSolTxParams> => {
  const res = await axios.post(`${BASE}/build/unstake`, {
    walletAddress,
    amount,
  });
  return res.data.data;
};

export const buildClaim = async (
  walletAddress: string,
): Promise<IEverstakeSolTxParams> => {
  const res = await axios.post(`${BASE}/build/claim`, { walletAddress });
  return res.data.data;
};

export const getStakeAccountDeposit = async (
  assetId: string,
): Promise<string> => {
  const res = await axios.post(`${SOLANA_TXN_BASE}/rent-exempt-fee`, {
    responseType: 'v2',
    network: solanaCoinList[assetId].network,
    accountDataLength: STAKE_ACCOUNT_DATA_LENGTH,
  });
  const fee = res.data?.rentExemptFee;
  if (fee === undefined || fee === null)
    throw new Error('Server: Invalid rent exempt fee from server');
  return String(fee);
};

export const getNetworkFee = async (
  unsignedTxHex: string,
  assetId: string,
): Promise<string> => {
  const res = await axios.post(`${SOLANA_TXN_BASE}/fees`, {
    responseType: 'v2',
    network: solanaCoinList[assetId].network,
    message: Buffer.from(unsignedTxHex, 'hex').toString('base64'),
  });
  const fees = res.data?.fees ?? '0';
  return typeof fees === 'number' ? fees.toString() : String(fees);
};

export const broadcastSignedTransaction = async (
  signedTransaction: string,
  assetId: string,
): Promise<string> => {
  const res = await axios.post(`${SOLANA_TXN_BASE}/broadcast`, {
    transaction: signedTransaction,
    network: solanaCoinList[assetId].network,
  });
  const signature = res.data?.signature;
  if (!signature) throw new Error('Server: Invalid txn hash from server');
  return signature;
};

// export const getLatestBlockhash = async (assetId: string): Promise<string> => {
//   const res = await axios.post(`${SOLANA_TXN_BASE}/blockhash`, {
//     network: solanaCoinList[assetId].network,
//   });
//   const hash = res.data?.hash;
//   if (!hash) throw new Error('Server: Invalid solana blockhash from server');
//   return hash;
// };
