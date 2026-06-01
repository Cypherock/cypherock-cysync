import { IPreparedEvmTransaction } from '../transaction';
import {
  IHyspEvmPrepareParams,
  IHyspEvmApproveRedeemParams,
  IHyspEvmRedeemPrepareParams,
} from './types';
import { callHyspBuildEndpoint, buildPreparedTxn } from './utils';

export * from './types';

export const prepareApproveDeposit = async (
  params: IHyspEvmPrepareParams,
): Promise<IPreparedEvmTransaction> => {
  const { txn, chain, walletAddress, tokenAddress, amount } = params;
  const serverTx = await callHyspBuildEndpoint('build/approve-deposit', {
    chain,
    walletAddress,
    tokenAddress,
    amount,
  });
  return buildPreparedTxn(serverTx, txn);
};

export const prepareDeposit = async (
  params: IHyspEvmPrepareParams,
): Promise<IPreparedEvmTransaction> => {
  const { txn, chain, walletAddress, tokenAddress, amount } = params;
  const serverTx = await callHyspBuildEndpoint('build/deposit', {
    chain,
    walletAddress,
    tokenAddress,
    amount,
  });
  return buildPreparedTxn(serverTx, txn);
};

export const prepareApproveRedeem = async (
  params: IHyspEvmApproveRedeemParams,
): Promise<IPreparedEvmTransaction> => {
  const { txn, chain, walletAddress, amount } = params;
  const serverTx = await callHyspBuildEndpoint('build/approve-redeem', {
    chain,
    walletAddress,
    amount,
  });
  return buildPreparedTxn(serverTx, txn);
};

export const prepareRedeemInstant = async (
  params: IHyspEvmRedeemPrepareParams,
): Promise<IPreparedEvmTransaction> => {
  const { txn, chain, walletAddress, tokenOut, amount } = params;
  const serverTx = await callHyspBuildEndpoint('build/redeem-instant', {
    chain,
    walletAddress,
    tokenAddress: tokenOut,
    amount,
  });
  return buildPreparedTxn(serverTx, txn);
};

export const prepareRedeemQueue = async (
  params: IHyspEvmRedeemPrepareParams,
): Promise<IPreparedEvmTransaction> => {
  const { txn, chain, walletAddress, tokenOut, amount } = params;
  const serverTx = await callHyspBuildEndpoint('build/redeem-queue', {
    chain,
    walletAddress,
    tokenAddress: tokenOut,
    amount,
  });
  return buildPreparedTxn(serverTx, txn);
};
