import axios from 'axios';

import { config } from '~/config';

const BASE = `${config.API_CYPHEROCK}/everstake/pol`;

export interface IEverstakePolTxParams {
  to: string;
  value: string;
  data: string;
  gasLimit: string;
}

export interface IEverstakePolAllowance {
  sufficient: boolean;
  allowance: string;
}

export interface IEverstakePolApproveResult {
  alreadyApproved: boolean;
  tx?: IEverstakePolTxParams;
}

export interface IEverstakePolUnbondingInfo {
  amount: string;
  withdrawEpoch: string;
  unbondNonce: string;
  isClaimable: boolean;
  checkpointsRemaining: number;
}

export interface IEverstakePolPosition {
  stakedBalance: string;
  claimableRewards: string;
  unbonding: IEverstakePolUnbondingInfo | null;
  currentEpoch: string;
}

export const checkAllowance = async (
  walletAddress: string,
  amount: string,
): Promise<IEverstakePolAllowance> => {
  const res = await axios.get(`${BASE}/allowance`, {
    params: { walletAddress, amount },
  });
  return res.data.data;
};

export const getUserPosition = async (
  walletAddress: string,
): Promise<IEverstakePolPosition> => {
  const res = await axios.get(`${BASE}/position`, {
    params: { walletAddress },
  });
  return res.data.data;
};

export const buildApprove = async (
  walletAddress: string,
  amount: string,
): Promise<IEverstakePolApproveResult> => {
  const res = await axios.post(`${BASE}/build/approve`, {
    walletAddress,
    amount,
  });
  return res.data.data;
};

export const buildStake = async (
  walletAddress: string,
  amount: string,
): Promise<IEverstakePolTxParams> => {
  const res = await axios.post(`${BASE}/build/stake`, {
    walletAddress,
    amount,
  });
  return res.data.data;
};

export const buildUnstake = async (
  walletAddress: string,
  amount: string,
): Promise<IEverstakePolTxParams> => {
  const res = await axios.post(`${BASE}/build/unstake`, {
    walletAddress,
    amount,
  });
  return res.data.data;
};

export const buildClaimUnstake = async (
  walletAddress: string,
): Promise<IEverstakePolTxParams> => {
  const res = await axios.post(`${BASE}/build/claim-unstake`, {
    walletAddress,
  });
  return res.data.data;
};

export const buildClaimRewards = async (
  walletAddress: string,
): Promise<IEverstakePolTxParams> => {
  const res = await axios.post(`${BASE}/build/claim-rewards`, {
    walletAddress,
  });
  return res.data.data;
};

export const buildRestake = async (
  walletAddress: string,
): Promise<IEverstakePolTxParams> => {
  const res = await axios.post(`${BASE}/build/restake`, { walletAddress });
  return res.data.data;
};
