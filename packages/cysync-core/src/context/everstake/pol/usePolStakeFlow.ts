import { IPreparedEvmTransaction } from '@cypherock/coin-support-evm';
import { IAccount } from '@cypherock/db-interfaces';
import { MutableRefObject, useEffect, useState } from 'react';

import * as everstakePolService from '~/services/everstakePolService';
import logger from '~/utils/logger';

import {
  APPROVE_CONFIRM_POLL_INTERVAL_MS,
  APPROVE_CONFIRM_SOFT_TIMEOUT_MS,
  EverstakeStep,
} from '../core/types';

export const usePolStakeFlow = (params: {
  step: EverstakeStep;
  setStep: (s: EverstakeStep) => void;
  selectedAccount: IAccount | undefined;
  amount: string;
  customGasPrice: number | undefined;
  setCustomGasPrice: (v: number | undefined) => void;
  setIsFeeLoading: (v: boolean) => void;
  stakeTxn: IPreparedEvmTransaction | undefined;
  setStakeTxn: (t: IPreparedEvmTransaction) => void;
  approveTxn: IPreparedEvmTransaction | undefined;
  setApproveTxn: (t: IPreparedEvmTransaction) => void;
  buildEverstakeTxn: (
    p: everstakePolService.IEverstakePolTxParams,
  ) => Promise<IPreparedEvmTransaction>;
  applyCustomGas: (
    txn: IPreparedEvmTransaction,
    gwei: number,
  ) => IPreparedEvmTransaction;
  pendingTxnRef: MutableRefObject<IPreparedEvmTransaction | undefined>;
}) => {
  const {
    step,
    setStep,
    selectedAccount,
    amount,
    customGasPrice,
    setCustomGasPrice,
    setIsFeeLoading,
    stakeTxn,
    setStakeTxn,
    approveTxn,
    setApproveTxn,
    buildEverstakeTxn,
    applyCustomGas,
    pendingTxnRef,
  } = params;

  const [approveTxHash, setApproveTxHash] = useState<string>();
  const [approveTakingLonger, setApproveTakingLonger] = useState(false);

  const proceedToStakeFee = async () => {
    setStep('stakeFee');
    setIsFeeLoading(true);
    setCustomGasPrice(undefined);
    try {
      const txParams = await everstakePolService.buildStake(
        selectedAccount!.xpubOrAddress,
        amount,
      );
      const prepared = await buildEverstakeTxn(txParams);
      setStakeTxn(prepared);
    } finally {
      setIsFeeLoading(false);
    }
  };

  const handleStakeFlow = async () => {
    if (step === 'consent') {
      setStep('stakeInput');
      return;
    }

    if (step === 'stakeInput') {
      setIsFeeLoading(true);
      try {
        const allowance = await everstakePolService.checkAllowance(
          selectedAccount!.xpubOrAddress,
          amount,
        );
        if (!allowance.sufficient) {
          const approveResult = await everstakePolService.buildApprove(
            selectedAccount!.xpubOrAddress,
            amount,
          );
          if (approveResult.tx) {
            const prepared = await buildEverstakeTxn(approveResult.tx);
            setApproveTxn(prepared);
            setCustomGasPrice(undefined);
            setStep('approveFee');
            return;
          }
        }
      } finally {
        setIsFeeLoading(false);
      }
      await proceedToStakeFee();
      return;
    }

    if (step === 'approveFee') {
      const finalTxn = customGasPrice
        ? applyCustomGas(approveTxn!, customGasPrice)
        : approveTxn!;
      pendingTxnRef.current = finalTxn;
      setStep('approving');
      return;
    }

    if (step === 'stakeFee') {
      const finalTxn = customGasPrice
        ? applyCustomGas(stakeTxn!, customGasPrice)
        : stakeTxn!;
      pendingTxnRef.current = finalTxn;
      setStep('staking');
    }
  };

  const onApproveBroadcast = (hash: string) => {
    setApproveTxHash(hash);
    setStep('confirmingApprove');
  };

  useEffect(() => {
    if (step !== 'confirmingApprove') return undefined;
    if (!selectedAccount?.xpubOrAddress) return undefined;

    let cancelled = false;
    setApproveTakingLonger(false);

    const poll = async () => {
      if (cancelled) return;
      try {
        const allowance = await everstakePolService.checkAllowance(
          selectedAccount.xpubOrAddress,
          amount,
        );
        if (allowance.sufficient && !cancelled) {
          cancelled = true;
          clearInterval(intervalId);
          clearTimeout(timeoutId);
          await proceedToStakeFee();
        }
      } catch (e: any) {
        logger.error('Everstake approve confirmation poll failed', e as object);
      }
    };

    const intervalId = setInterval(poll, APPROVE_CONFIRM_POLL_INTERVAL_MS);
    const timeoutId = setTimeout(() => {
      if (!cancelled) setApproveTakingLonger(true);
    }, APPROVE_CONFIRM_SOFT_TIMEOUT_MS);
    poll();

    return () => {
      cancelled = true;
      clearInterval(intervalId);
      clearTimeout(timeoutId);
    };
  }, [step, selectedAccount?.xpubOrAddress]);

  return {
    handleStakeFlow,
    onApproveBroadcast,
    approveTxHash,
    approveTakingLonger,
  };
};
