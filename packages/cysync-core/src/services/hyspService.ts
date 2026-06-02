import axios from 'axios';
import { HyspChain } from '@cypherock/coin-support-evm';
import { makePostRequest } from '@cypherock/cysync-utils';

const HYSP_API_BASE = 'http://localhost:5001';
const BASE = `${HYSP_API_BASE}/hysp`;

export interface IHyspVaultInfo {
  apy: number;
  price: string;
  instantLiquidity: string;
  depositFee: number;
  redeemFee: number;
}

export interface IHyspPosition {
  usdcBalance: string;
  usdtBalance: string | null;
  mevUsdBalance: string;
  mevUsdValueUsdc: string;
}

export interface IHyspAllowance {
  allowance: string;
  sufficient: boolean;
}

export interface IHyspQueueRequest {
  requestId: string;
  amountMToken: string;
  mevUsdValueUsdc: string;
  status: 'Pending' | 'Processed' | 'Canceled';
  tokenOut: string;
  feeAmount: string;
  mTokenRate: string;
  tokenOutRate: string;
}

export const getVaultInfo = async (
  chain: HyspChain,
  countryCode?: string,
): Promise<IHyspVaultInfo> => {
  const res = await axios.get(`${BASE}/vault-info`, {
    params: { chain, ...(countryCode ? { countryCode } : {}) },
  });
  return res.data.data;
};

export const getUserPosition = async (
  chain: HyspChain,
  walletAddress: string,
  countryCode?: string,
): Promise<IHyspPosition> => {
  const res = await axios.get(`${BASE}/position`, {
    params: { chain, walletAddress, ...(countryCode ? { countryCode } : {}) },
  });
  return res.data.data;
};

export const getQueueStatus = async (
  chain: HyspChain,
  walletAddress: string,
  status?: 'Pending' | 'Processed' | 'Canceled',
  countryCode?: string,
): Promise<IHyspQueueRequest[]> => {
  const res = await axios.get(`${BASE}/queue-status`, {
    params: {
      chain,
      walletAddress,
      ...(status ? { status } : {}),
      ...(countryCode ? { countryCode } : {}),
    },
  });
  return res.data.data;
};

export const checkAllowance = async (params: {
  chain: HyspChain;
  walletAddress: string;
  tokenAddress: string;
  vaultType: 'deposit' | 'redeem';
  amount: number;
  countryCode?: string;
}): Promise<IHyspAllowance> => {
  const res = await makePostRequest(`${BASE}/check-allowance`, params);
  return res.data.data;
};

export const getEthTransactionStatus = async (
  txHash: string,
  network: string,
): Promise<string | null> => {
  const res = await makePostRequest(
    `${HYSP_API_BASE}/eth/transaction/transaction-status`,
    { txHash, network },
  );
  // Returns receipt with status 1 (success) | 0 (failed) | null (pending)
  return res.data?.result?.status ?? null;
};
