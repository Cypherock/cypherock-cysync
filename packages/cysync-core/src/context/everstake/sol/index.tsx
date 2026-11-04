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

import * as everstakeSolService from '~/services/everstakeSolService';
import logger from '~/utils/logger';

import { SOL_SIGNING_STEPS, SolEverstakeMode, SolEverstakeStep } from './types';
import { useSolAccountSelection } from './useSolAccountSelection';
import { useSolPosition } from './useSolPosition';
import { useSolSigning } from './useSolSigning';

export type { SolEverstakeMode, SolEverstakeStep };

interface ISolEverstakeContext {
  mode: SolEverstakeMode;
  setMode: (m: SolEverstakeMode) => void;
  step: SolEverstakeStep;
  selectedWallet: IWallet | undefined;
  selectedAccount: ReturnType<typeof useSolAccountSelection>['selectedAccount'];
  walletDropdownList: any[];
  accountDropdownList: DropDownItemProps[];
  handleWalletChange: (id?: string) => void;
  handleAccountChange: (id?: string) => void;
  unitAbbr: string;
  // stake
  amount: string;
  setAmount: (a: string) => void;
  // unstake
  unstakeAmount: string;
  setUnstakeAmount: (a: string) => void;
  // claim
  claimLamports: string;
  // shared
  networkFee: string | undefined; // lamports
  isFeeLoading: boolean;
  txHash: string | undefined;
  deviceEvents: Record<number, boolean | undefined>;
  error: Error | undefined;
  position: everstakeSolService.IEverstakeSolPosition | undefined;
  dataLoading: boolean;
  onProceed: () => Promise<void>;
  isProceeding: boolean;
  onClose: () => void;
}

const SolEverstakeContext: Context<ISolEverstakeContext> =
  createContext<ISolEverstakeContext>({} as ISolEverstakeContext);

const getInitialStep = (m: SolEverstakeMode): SolEverstakeStep => {
  if (m === 'unstake') return 'unstakeInfo';
  if (m === 'claim') return 'claimInfo';
  return 'consent';
};

export const SolEverstakeProvider: FC<{
  children: ReactNode;
  onClose: () => void;
  initialAccountId?: string;
  initialWalletId?: string;
  initialMode?: SolEverstakeMode;
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
    unitAbbr,
  } = useSolAccountSelection({ initialWalletId, initialAccountId });

  const [mode, setModeState] = useState<SolEverstakeMode>(
    initialMode ?? 'stake',
  );
  const [step, setStep] = useState<SolEverstakeStep>(
    getInitialStep(initialMode ?? 'stake'),
  );

  const [amount, setAmount] = useState('');
  const [unstakeAmount, setUnstakeAmount] = useState('');
  const [claimLamports, setClaimLamports] = useState('0');
  const [networkFee, setNetworkFee] = useState<string | undefined>();
  const [isFeeLoading, setIsFeeLoading] = useState(false);
  const [txHash, setTxHash] = useState<string | undefined>();
  const [error, setError] = useState<Error>();
  const [isProceeding, setIsProceeding] = useState(false);

  const { position, dataLoading, refreshPosition } = useSolPosition({
    selectedAccount,
  });

  const onSigningComplete = (completedStep: string, hash: string) => {
    setTxHash(hash);
    const stepToDone: Record<string, SolEverstakeStep> = {
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

  const { pendingTxHexRef, deviceEvents, cancelSigning } = useSolSigning({
    selectedAccount,
    step,
    signingSteps: SOL_SIGNING_STEPS,
    onSigningComplete,
    onSigningError,
    refreshPosition,
  });

  const setMode = (m: SolEverstakeMode) => {
    setModeState(m);
    setStep(getInitialStep(m));
    setError(undefined);
    setNetworkFee(undefined);
    pendingTxHexRef.current = undefined;
    cancelSigning();
  };

  const buildForReview = async (
    build: () => Promise<everstakeSolService.IEverstakeSolTxParams>,
  ) => {
    setIsFeeLoading(true);
    setNetworkFee(undefined);
    pendingTxHexRef.current = undefined;
    try {
      const { unsignedTxHex } = await build();
      pendingTxHexRef.current = unsignedTxHex;
      try {
        setNetworkFee(
          await everstakeSolService.getNetworkFee(
            unsignedTxHex,
            selectedAccount!.assetId,
          ),
        );
      } catch (e: any) {
        logger.error('Everstake SOL fee estimate failed', e as object);
      }
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
      setStep('stakeReview');
      await buildForReview(() =>
        everstakeSolService.buildStake(selectedAccount!.xpubOrAddress, amount),
      );
      return;
    }
    if (step === 'stakeReview' && pendingTxHexRef.current) {
      setStep('staking');
    }
  };

  const handleUnstakeFlow = async () => {
    if (step === 'unstakeInfo') {
      setStep('unstakeInput');
      return;
    }
    if (step === 'unstakeInput') {
      setStep('unstakeReview');
      await buildForReview(() =>
        everstakeSolService.buildUnstake(
          selectedAccount!.xpubOrAddress,
          unstakeAmount,
        ),
      );
      return;
    }
    if (step === 'unstakeReview' && pendingTxHexRef.current) {
      setStep('unstaking');
    }
  };

  const handleClaimFlow = async () => {
    if (step === 'claimInfo') {
      setClaimLamports(position?.deactivated.lamports ?? '0');
      setStep('claimReview');
      await buildForReview(() =>
        everstakeSolService.buildClaim(selectedAccount!.xpubOrAddress),
      );
      return;
    }
    if (step === 'claimReview' && pendingTxHexRef.current) {
      setStep('claiming');
    }
  };

  const onProceed = async () => {
    setIsProceeding(true);
    try {
      if (mode === 'stake') await handleStakeFlow();
      else if (mode === 'unstake') await handleUnstakeFlow();
      else await handleClaimFlow();
    } catch (e: any) {
      logger.error('Everstake SOL flow error', e as object);
      const serverMessage: string | undefined = e?.response?.data?.message;
      if (serverMessage) {
        setError(new Error(serverMessage));
      } else if (e instanceof Error) {
        setError(e);
      } else {
        setError(new Error(e?.message ?? 'An error occurred'));
      }
      setStep('error');
    } finally {
      setIsProceeding(false);
    }
  };

  const contextValue = useMemo(
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
      unitAbbr,
      amount,
      setAmount,
      unstakeAmount,
      setUnstakeAmount,
      claimLamports,
      networkFee,
      isFeeLoading,
      txHash,
      deviceEvents,
      error,
      position,
      dataLoading,
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
      unitAbbr,
      amount,
      unstakeAmount,
      claimLamports,
      networkFee,
      isFeeLoading,
      txHash,
      deviceEvents,
      error,
      position,
      dataLoading,
      isProceeding,
    ],
  );

  return (
    <SolEverstakeContext.Provider value={contextValue}>
      {children}
    </SolEverstakeContext.Provider>
  );
};

export const useSolEverstake = () => useContext(SolEverstakeContext);

SolEverstakeProvider.defaultProps = {
  initialAccountId: undefined,
  initialWalletId: undefined,
  initialMode: undefined,
};
