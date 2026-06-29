import axios from 'axios';

const BASE = 'http://localhost:5001/everstake/eth';

export interface IEverstakePoolInfo {
  balance: string;
  pendingBalance: string;
  pendingDepositedBalance: string;
  pendingRestakedRewards: string;
  readyforAutocompoundRewardsAmount: string;
  minStakeAmount: string;
  poolFee: string;
}

export interface IEverstakeUserPosition {
  depositedBalanceOf: string;
  autocompoundBalanceOf: string;
  pendingBalanceOf: string;
  pendingDepositedBalanceOf: string;
  pendingRestakedRewardOf: string;
}

export interface IEverstakeWithdrawRequest {
  requested: string;
  readyForClaim: string;
}

export interface IEverstakeSimulateUnstake {
  instantAmount: string;
  queuedAmount: string;
  isFullyInstant: boolean;
  isFullyQueued: boolean;
}

export interface IEverstakeTxParams {
  to: string;
  value: string;
  data: string;
  gasLimit: string;
}

export const getPoolInfo = async (): Promise<IEverstakePoolInfo> => {
  const res = await axios.get(`${BASE}/pool-info`);
  return res.data.data;
};

export const getUserPosition = async (
  walletAddress: string,
): Promise<IEverstakeUserPosition> => {
  const res = await axios.get(`${BASE}/position`, {
    params: { walletAddress },
  });
  return res.data.data;
};

export const getWithdrawRequest = async (
  walletAddress: string,
): Promise<IEverstakeWithdrawRequest> => {
  const res = await axios.get(`${BASE}/withdraw-request`, {
    params: { walletAddress },
  });
  return res.data.data;
};

export const simulateUnstake = async (
  walletAddress: string,
  amount: string,
): Promise<IEverstakeSimulateUnstake> => {
  const res = await axios.post(`${BASE}/simulate-unstake`, {
    walletAddress,
    amount,
  });
  return res.data.data;
};

export const buildStake = async (
  walletAddress: string,
  amount: string,
): Promise<IEverstakeTxParams> => {
  const res = await axios.post(`${BASE}/build/stake`, {
    walletAddress,
    amount,
  });
  return res.data.data;
};

export const buildUnstake = async (
  walletAddress: string,
  amount: string,
): Promise<IEverstakeTxParams> => {
  const res = await axios.post(`${BASE}/build/unstake`, {
    walletAddress,
    amount,
  });
  return res.data.data;
};

export const buildClaim = async (
  walletAddress: string,
): Promise<IEverstakeTxParams> => {
  const res = await axios.post(`${BASE}/build/claim`, { walletAddress });
  return res.data.data;
};
