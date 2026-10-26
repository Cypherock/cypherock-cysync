import { IPreparedEvmTransaction } from '@cypherock/coin-support-evm';
import { DropDownItemProps } from '@cypherock/cysync-ui';
import { IWallet } from '@cypherock/db-interfaces';
import React, {
  Context,
  FC,
  ReactNode,
  createContext,
  useContext,
  useMemo,
  useState,
} from 'react';

import { IEverstakeAsset } from '~/constants/everstake';
import * as everstakeService from '~/services/everstakeEthService';
import * as everstakePolService from '~/services/everstakePolService';
import logger from '~/utils/logger';

import { useEverstakeAccountSelection } from './core/useEverstakeAccountSelection';
import { useEverstakePosition } from './core/useEverstakePosition';
import { useEverstakeSigning } from './core/useEverstakeSigning';
import {
  CLAIM_LIKE_MODES,
  EverstakeMode,
  EverstakeStep,
  SIGNING_STEPS,
} from './core/types';
import { useEthStakeFlow } from './eth/useEthStakeFlow';
import { usePolStakeFlow } from './pol/usePolStakeFlow';

export type { EverstakeMode };

interface IEverstakeContext {
  mode: EverstakeMode;
  setMode: (m: EverstakeMode) => void;
  step: EverstakeStep;
  selectedWallet: IWallet | undefined;
  selectedAccount: ReturnType<
    typeof useEverstakeAccountSelection
  >['selectedAccount'];
  walletDropdownList: any[];
  accountDropdownList: DropDownItemProps[];
  handleWalletChange: (id?: string) => void;
  handleAccountChange: (id?: string) => void;
  // asset info (drives ETH vs POL branching in the UI)
  assetConfig: IEverstakeAsset | undefined;
  isPol: boolean;
  unitAbbr: string;
  // stake
  amount: string;
  setAmount: (a: string) => void;
  stakeTxn: IPreparedEvmTransaction | undefined;
  // POL approve sub-flow
  approveTxn: IPreparedEvmTransaction | undefined;
  approveTxHash: string | undefined;
  approveTakingLonger: boolean;
  // unstake
  unstakeAmount: string;
  setUnstakeAmount: (a: string) => void;
  unstakeTxn: IPreparedEvmTransaction | undefined;
  // claim / claimRewards / claimUnstake / restake
  claimTxn: IPreparedEvmTransaction | undefined;
  claimAmountRaw: string;
  // shared
  isFeeLoading: boolean;
  customGasPrice: number | undefined;
  setCustomGasPrice: (v: number) => void;
  txHash: string | undefined;
  deviceEvents: Record<number, boolean | undefined>;
  error: Error | undefined;
  poolInfo: everstakeService.IEverstakePoolInfo | undefined;
  userPosition: everstakeService.IEverstakeUserPosition | undefined;
  withdrawRequest: everstakeService.IEverstakeWithdrawRequest | undefined;
  polPosition: everstakePolService.IEverstakePolPosition | undefined;
  dataLoading: boolean;
  minStakeAmount: string;
  onProceed: () => Promise<void>;
  isProceeding: boolean;
  onClose: () => void;
}

const EverstakeContext: Context<IEverstakeContext> =
  createContext<IEverstakeContext>({} as IEverstakeContext);

export const EverstakeProvider: FC<{
  children: ReactNode;
  onClose: () => void;
  initialAccountId?: string;
  initialWalletId?: string;
  initialMode?: EverstakeMode;
}> = ({
  children,
  onClose,
  initialAccountId,
  initialWalletId,
  initialMode,
}) => {
  const {
    selectedWallet,
    handleWalletChange,
    walletDropdownList,
    selectedAccount,
    handleAccountChange,
    accountDropdownList,
    assetConfig,
    isPol,
    unitAbbr,
  } = useEverstakeAccountSelection({ initialWalletId, initialAccountId });

  const getInitialStep = (m: EverstakeMode): EverstakeStep => {
    if (m === 'unstake') return isPol ? 'unstakeInfo' : 'unstakeInput';
    if (CLAIM_LIKE_MODES.includes(m)) {
      return m === 'claim' ? 'claimFee' : 'claimInfo';
    }
    return 'consent';
  };

  const [mode, setModeState] = useState<EverstakeMode>(initialMode ?? 'stake');
  const [step, setStep] = useState<EverstakeStep>(
    getInitialStep(initialMode ?? 'stake'),
  );

  // stake
  const [amount, setAmount] = useState('');
  const [stakeTxn, setStakeTxn] = useState<IPreparedEvmTransaction>();
  const [isFeeLoading, setIsFeeLoading] = useState(false);
  const [customGasPrice, setCustomGasPrice] = useState<number | undefined>();

  // POL approve sub-flow
  const [approveTxn, setApproveTxn] = useState<IPreparedEvmTransaction>();

  // unstake
  const [unstakeAmount, setUnstakeAmount] = useState('');
  const [unstakeTxn, setUnstakeTxn] = useState<IPreparedEvmTransaction>();

  // claim / claimRewards / claimUnstake / restake
  const [claimTxn, setClaimTxn] = useState<IPreparedEvmTransaction>();

  const [error, setError] = useState<Error>();

  const {
    poolInfo,
    userPosition,
    withdrawRequest,
    polPosition,
    dataLoading,
    refreshPosition,
  } = useEverstakePosition({ selectedAccount, isPol });

  const onSigningComplete = (completedStep: string, hash: string) => {
    if (completedStep === 'approving') {
      polStakeFlow.onApproveBroadcast(hash);
      return;
    }
    setTxHash(hash);
    const stepToDone: Record<string, EverstakeStep> = {
      staking: 'stakeDone',
      unstaking: 'unstakeDone',
      claiming: 'claimDone',
    };
    setStep(stepToDone[completedStep] ?? 'claimDone');
  };

  const onSigningError = (err: Error) => {
    setError(err);
    setStep('error');
  };

  const {
    buildEverstakeTxn,
    applyCustomGas,
    pendingTxnRef,
    deviceEvents,
    txHash,
    setTxHash,
    cancelSigning,
  } = useEverstakeSigning({
    selectedAccount,
    step,
    signingSteps: SIGNING_STEPS,
    onSigningComplete,
    onSigningError,
    refreshPosition,
  });

  const ethStakeFlow = useEthStakeFlow({
    step,
    setStep,
    selectedAccount,
    amount,
    customGasPrice,
    setCustomGasPrice,
    setIsFeeLoading,
    stakeTxn,
    setStakeTxn,
    buildEverstakeTxn: buildEverstakeTxn as (
      p: everstakeService.IEverstakeTxParams,
    ) => Promise<IPreparedEvmTransaction>,
    applyCustomGas,
    pendingTxnRef,
  });

  const polStakeFlow = usePolStakeFlow({
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
    buildEverstakeTxn: buildEverstakeTxn as (
      p: everstakePolService.IEverstakePolTxParams,
    ) => Promise<IPreparedEvmTransaction>,
    applyCustomGas,
    pendingTxnRef,
  });

  const setMode = (m: EverstakeMode) => {
    setModeState(m);
    setStep(getInitialStep(m));
    setError(undefined);
    setCustomGasPrice(undefined);
    cancelSigning();
  };

  const handleUnstakeFlow = async () => {
    if (step === 'unstakeInfo') {
      setStep('unstakeInput');
      return;
    }

    if (step === 'unstakeInput') {
      setStep('unstakeFee');
      setIsFeeLoading(true);
      setCustomGasPrice(undefined);
      try {
        const txParams = isPol
          ? await everstakePolService.buildUnstake(
              selectedAccount!.xpubOrAddress,
              unstakeAmount,
            )
          : await everstakeService.buildUnstake(
              selectedAccount!.xpubOrAddress,
              unstakeAmount,
            );
        const prepared = await buildEverstakeTxn(txParams);
        setUnstakeTxn(prepared);
      } finally {
        setIsFeeLoading(false);
      }
      return;
    }

    if (step === 'unstakeFee') {
      const finalTxn = customGasPrice
        ? applyCustomGas(unstakeTxn!, customGasPrice)
        : unstakeTxn!;
      pendingTxnRef.current = finalTxn;
      setStep('unstaking');
    }
  };

  const handleClaimFlow = async () => {
    if (step === 'claimInfo') {
      setStep('claimFee');
      return;
    }

    if (step === 'claimFee') {
      setIsFeeLoading(true);
      setCustomGasPrice(undefined);
      try {
        let txParams:
          | everstakeService.IEverstakeTxParams
          | everstakePolService.IEverstakePolTxParams;
        if (mode === 'claimRewards') {
          txParams = await everstakePolService.buildClaimRewards(
            selectedAccount!.xpubOrAddress,
          );
        } else if (mode === 'claimUnstake') {
          txParams = await everstakePolService.buildClaimUnstake(
            selectedAccount!.xpubOrAddress,
          );
        } else if (mode === 'restake') {
          txParams = await everstakePolService.buildRestake(
            selectedAccount!.xpubOrAddress,
          );
        } else {
          txParams = await everstakeService.buildClaim(
            selectedAccount!.xpubOrAddress,
          );
        }
        const prepared = await buildEverstakeTxn(txParams);
        setClaimTxn(prepared);
      } finally {
        setIsFeeLoading(false);
      }
      setStep('claimConfirm');
      return;
    }

    if (step === 'claimConfirm') {
      const finalTxn = customGasPrice
        ? applyCustomGas(claimTxn!, customGasPrice)
        : claimTxn!;
      pendingTxnRef.current = finalTxn;
      setStep('claiming');
    }
  };

  const [isProceeding, setIsProceeding] = useState(false);

  const onProceed = async () => {
    setIsProceeding(true);
    try {
      if (mode === 'stake') {
        await (isPol
          ? polStakeFlow.handleStakeFlow()
          : ethStakeFlow.handleStakeFlow());
      } else if (mode === 'unstake') await handleUnstakeFlow();
      else await handleClaimFlow();
    } catch (e: any) {
      logger.error('Everstake flow error', e as object);
      setError(
        e instanceof Error ? e : new Error(e?.message ?? 'An error occurred'),
      );
      setStep('error');
    } finally {
      setIsProceeding(false);
    }
  };

  const claimAmountRaw = useMemo(() => {
    if (isPol) {
      if (mode === 'claimUnstake') return polPosition?.unbonding?.amount ?? '0';
      // claimRewards and restake both act on the currently claimable rewards
      return polPosition?.claimableRewards ?? '0';
    }
    return withdrawRequest?.readyForClaim ?? '0';
  }, [isPol, mode, polPosition, withdrawRequest]);

  const minStakeAmount = isPol
    ? assetConfig?.minStakeAmount ?? '1'
    : poolInfo?.minStakeAmount ?? '0.01';

  const contextValue = React.useMemo(
    () => ({
      mode,
      setMode,
      step,
      selectedWallet,
      selectedAccount,
      walletDropdownList,
      accountDropdownList,
      handleWalletChange,
      handleAccountChange,
      assetConfig,
      isPol,
      unitAbbr,
      amount,
      setAmount,
      stakeTxn,
      approveTxn,
      approveTxHash: polStakeFlow.approveTxHash,
      approveTakingLonger: polStakeFlow.approveTakingLonger,
      isFeeLoading,
      customGasPrice,
      setCustomGasPrice,
      unstakeAmount,
      setUnstakeAmount,
      unstakeTxn,
      claimTxn,
      claimAmountRaw,
      txHash,
      deviceEvents,
      error,
      poolInfo,
      userPosition,
      withdrawRequest,
      polPosition,
      dataLoading,
      minStakeAmount,
      onProceed,
      isProceeding,
      onClose,
    }),
    [
      mode,
      step,
      selectedWallet,
      selectedAccount,
      walletDropdownList,
      accountDropdownList,
      assetConfig,
      isPol,
      unitAbbr,
      amount,
      stakeTxn,
      approveTxn,
      polStakeFlow.approveTxHash,
      polStakeFlow.approveTakingLonger,
      isFeeLoading,
      customGasPrice,
      unstakeAmount,
      unstakeTxn,
      claimTxn,
      claimAmountRaw,
      txHash,
      deviceEvents,
      error,
      poolInfo,
      userPosition,
      withdrawRequest,
      polPosition,
      dataLoading,
      minStakeAmount,
      isProceeding,
    ],
  );

  return (
    <EverstakeContext.Provider value={contextValue}>
      {children}
    </EverstakeContext.Provider>
  );
};

export const useEverstake = () => useContext(EverstakeContext);

EverstakeProvider.defaultProps = {
  initialAccountId: undefined,
  initialWalletId: undefined,
  initialMode: undefined,
};
