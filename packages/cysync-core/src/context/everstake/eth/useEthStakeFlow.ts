import { IPreparedEvmTransaction } from '@cypherock/coin-support-evm';
import { IAccount } from '@cypherock/db-interfaces';
import { MutableRefObject } from 'react';
import * as everstakeService from '~/services/everstakeEthService';
import { EverstakeStep } from '../core/types';

export const useEthStakeFlow = (params: {
  step: EverstakeStep;
  setStep: (s: EverstakeStep) => void;
  selectedAccount: IAccount | undefined;
  amount: string;
  customGasPrice: number | undefined;
  setCustomGasPrice: (v: number | undefined) => void;
  setIsFeeLoading: (v: boolean) => void;
  stakeTxn: IPreparedEvmTransaction | undefined;
  setStakeTxn: (t: IPreparedEvmTransaction) => void;
  buildEverstakeTxn: (
    p: everstakeService.IEverstakeTxParams,
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
    buildEverstakeTxn,
    applyCustomGas,
    pendingTxnRef,
  } = params;

  const handleStakeFlow = async () => {
    if (step === 'consent') {
      setStep('stakeInput');
      return;
    }

    if (step === 'stakeInput') {
      setStep('stakeFee');
      setIsFeeLoading(true);
      setCustomGasPrice(undefined);
      try {
        const txParams = await everstakeService.buildStake(
          selectedAccount!.xpubOrAddress,
          amount,
        );
        const prepared = await buildEverstakeTxn(txParams);
        setStakeTxn(prepared);
      } finally {
        setIsFeeLoading(false);
      }
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

  return { handleStakeFlow };
};
