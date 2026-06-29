import { getCoinSupport } from '@cypherock/coin-support';
import { IPreparedEvmTransaction } from '@cypherock/coin-support-evm';
import { ISignTransactionEvent } from '@cypherock/coin-support-interfaces';
import { EvmIdMap } from '@cypherock/coins';
import { BigNumber } from '@cypherock/cysync-utils';
import { IAccount, IWallet } from '@cypherock/db-interfaces';
import lodash from 'lodash';
import React, {
  Context,
  FC,
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Subscription } from 'rxjs';

import { syncAccounts } from '~/actions';
import { deviceLock, useDevice, useCurrency } from '~/context';
import { useWalletDropdown, useAccountDropdown } from '~/hooks';
import { useAppDispatch } from '~/store';
import { getDB } from '~/utils';
import logger from '~/utils/logger';
import * as everstakeService from '~/services/everstakeService';

export type EverstakeMode = 'stake' | 'unstake' | 'claim';

type EverstakeStep =
  | 'consent'
  | 'stakeInput'
  | 'stakeFee'
  | 'staking'
  | 'stakeDone'
  | 'unstakeInput'
  | 'unstakeFee'
  | 'unstaking'
  | 'unstakeDone'
  | 'claimFee'
  | 'claimConfirm'
  | 'claiming'
  | 'claimDone'
  | 'error';

const SIGNING_STEPS: EverstakeStep[] = ['staking', 'unstaking', 'claiming'];

interface IEverstakeContext {
  mode: EverstakeMode;
  setMode: (m: EverstakeMode) => void;
  step: EverstakeStep;
  selectedWallet: IWallet | undefined;
  selectedAccount: IAccount | undefined;
  walletDropdownList: any[];
  accountDropdownList: any[];
  handleWalletChange: (id?: string) => void;
  handleAccountChange: (id?: string) => void;
  // stake
  amount: string;
  setAmount: (a: string) => void;
  stakeTxn: IPreparedEvmTransaction | undefined;
  // unstake
  unstakeAmount: string;
  setUnstakeAmount: (a: string) => void;
  unstakeTxn: IPreparedEvmTransaction | undefined;
  // claim
  claimTxn: IPreparedEvmTransaction | undefined;
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
  dataLoading: boolean;
  minStakeAmount: string;
  onProceed: () => Promise<void>;
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
  const { connection } = useDevice();
  const dispatch = useAppDispatch();
  const { currentCurrency } = useCurrency();

  const getInitialStep = (m: EverstakeMode): EverstakeStep => {
    if (m === 'unstake') return 'unstakeInput';
    if (m === 'claim') return 'claimFee';
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

  // unstake
  const [unstakeAmount, setUnstakeAmount] = useState('');
  const [unstakeTxn, setUnstakeTxn] = useState<IPreparedEvmTransaction>();

  // claim
  const [claimTxn, setClaimTxn] = useState<IPreparedEvmTransaction>();

  // shared
  const [txHash, setTxHash] = useState<string | undefined>();
  const [deviceEvents, setDeviceEvents] = useState<
    Record<number, boolean | undefined>
  >({});
  const [error, setError] = useState<Error>();
  const [poolInfo, setPoolInfo] =
    useState<everstakeService.IEverstakePoolInfo>();
  const [userPosition, setUserPosition] =
    useState<everstakeService.IEverstakeUserPosition>();
  const [withdrawRequest, setWithdrawRequest] =
    useState<everstakeService.IEverstakeWithdrawRequest>();
  const [dataLoading, setDataLoading] = useState(false);

  const flowSubscription = useRef<Subscription | undefined>();
  const signedTxn = useRef<string | undefined>();

  useEffect(() => {
    everstakeService
      .getPoolInfo()
      .then(setPoolInfo)
      .catch((e: any) =>
        logger.error('Everstake poolInfo fetch failed', e as object),
      );
  }, []);

  const { selectedWallet, handleWalletChange, walletDropdownList } =
    useWalletDropdown(
      initialWalletId ? { walletId: initialWalletId } : undefined,
    );

  const { selectedAccount, handleAccountChange, accountDropdownList } =
    useAccountDropdown({
      selectedWallet,
      assetFilter: [EvmIdMap.ethereum],
      defaultAccountId: initialAccountId,
    });

  useEffect(() => {
    if (!selectedAccount?.xpubOrAddress) return;
    setDataLoading(true);
    Promise.all([
      everstakeService.getUserPosition(selectedAccount.xpubOrAddress),
      everstakeService.getWithdrawRequest(selectedAccount.xpubOrAddress),
    ])
      .then(([pos, wr]) => {
        setUserPosition(pos);
        setWithdrawRequest(wr);
      })
      .catch((e: any) =>
        logger.error('Everstake position fetch failed', e as object),
      )
      .finally(() => setDataLoading(false));
  }, [selectedAccount?.xpubOrAddress]);

  const setMode = (m: EverstakeMode) => {
    setModeState(m);
    setStep(getInitialStep(m));
    setError(undefined);
    setDeviceEvents({});
    setCustomGasPrice(undefined);
    flowSubscription.current?.unsubscribe();
  };

  const coinSupport = useCallback(() => {
    if (!selectedAccount) throw new Error('No account selected');
    return getCoinSupport(selectedAccount.familyId);
  }, [selectedAccount]);

  const getInitTxn = async (): Promise<IPreparedEvmTransaction> =>
    (await coinSupport().initializeTransaction({
      db: getDB(),
      accountId: selectedAccount!.__id ?? '',
    })) as IPreparedEvmTransaction;

  const applyCustomGas = (
    txn: IPreparedEvmTransaction,
    gweiOverride: number,
  ): IPreparedEvmTransaction => {
    const gasPriceWei = String(Math.round(gweiOverride * 1e9));
    const fee = new BigNumber(txn.computedData.gasLimit)
      .multipliedBy(gasPriceWei)
      .toString(10);
    return {
      ...txn,
      userInputs: { ...txn.userInputs, gasPrice: gasPriceWei },
      computedData: { ...txn.computedData, gasPrice: gasPriceWei, fee },
    };
  };

  const startSign = async (
    txn: IPreparedEvmTransaction,
    onSigned: (sig: string) => void,
    onDone: () => Promise<void>,
  ) => {
    if (!connection?.connection) throw new Error('Device not connected');
    const taskId = lodash.uniqueId('everstake-');
    await deviceLock.acquire(connection.device, taskId);
    const release = () => deviceLock.release(connection.device, taskId);
    setDeviceEvents({});
    flowSubscription.current = coinSupport()
      .signTransaction({
        connection: connection.connection,
        db: getDB(),
        transaction: txn,
      })
      .subscribe({
        next: (payload: ISignTransactionEvent<any>) => {
          if (payload.device) setDeviceEvents({ ...payload.device.events });
          if (payload.transaction) onSigned(payload.transaction as string);
        },
        error: (err: any) => {
          release();
          setError(
            err instanceof Error
              ? err
              : new Error(err?.message ?? 'Signing failed'),
          );
          setStep('error');
        },
        complete: () => {
          release();
          onDone().catch((err: any) => {
            const msg =
              err?.response?.data?.message ??
              err?.message ??
              'Broadcast failed';
            logger.error('Everstake post-sign error', err as object);
            setError(err instanceof Error ? err : new Error(msg));
            setStep('error');
          });
        },
      });
  };

  const broadcast = async (
    signed: string,
    txn: IPreparedEvmTransaction,
  ): Promise<string> => {
    const result = await coinSupport().broadcastTransaction({
      db: getDB(),
      signedTransaction: signed,
      transaction: txn,
    });
    if (selectedAccount) {
      dispatch(
        syncAccounts({
          accounts: [selectedAccount],
          currency: currentCurrency,
        }),
      );
      Promise.all([
        everstakeService.getUserPosition(selectedAccount.xpubOrAddress),
        everstakeService.getWithdrawRequest(selectedAccount.xpubOrAddress),
      ])
        .then(([pos, wr]) => {
          setUserPosition(pos);
          setWithdrawRequest(wr);
        })
        .catch((e: any) =>
          logger.error(
            'Everstake post-broadcast position refresh failed',
            e as object,
          ),
        );
    }
    return (result as any)?.hash ?? '';
  };

  const buildEverstakeTxn = async (
    serverTxParams: everstakeService.IEverstakeTxParams,
  ): Promise<IPreparedEvmTransaction> => {
    const initTxn = await getInitTxn();
    return {
      ...initTxn,
      userInputs: {
        ...initTxn.userInputs,
        outputs: [{ address: serverTxParams.to, amount: serverTxParams.value }],
      },
      computedData: {
        ...initTxn.computedData,
        output: { address: serverTxParams.to, amount: serverTxParams.value },
        data: serverTxParams.data,
        gasLimit: serverTxParams.gasLimit,
        fee: new BigNumber(serverTxParams.gasLimit)
          .multipliedBy(initTxn.computedData.gasPrice)
          .toString(10),
      },
    };
  };

  // Stake flow
  const pendingTxn = useRef<IPreparedEvmTransaction | undefined>();

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
      pendingTxn.current = finalTxn;
      setStep('staking');
    }
  };

  // Unstake flow
  const handleUnstakeFlow = async () => {
    if (step === 'unstakeInput') {
      setStep('unstakeFee');
      setIsFeeLoading(true);
      setCustomGasPrice(undefined);
      try {
        const txParams = await everstakeService.buildUnstake(
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
      pendingTxn.current = finalTxn;
      setStep('unstaking');
    }
  };

  // Claim flow
  const handleClaimFlow = async () => {
    if (step === 'claimFee') {
      setIsFeeLoading(true);
      setCustomGasPrice(undefined);
      try {
        const txParams = await everstakeService.buildClaim(
          selectedAccount!.xpubOrAddress,
        );
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
      pendingTxn.current = finalTxn;
      setStep('claiming');
    }
  };

  const startSigning = async () => {
    try {
      const txn = pendingTxn.current;
      if (!txn) return;
      const stepToDone: Record<string, EverstakeStep> = {
        staking: 'stakeDone',
        unstaking: 'unstakeDone',
        claiming: 'claimDone',
      };
      const doneStep: EverstakeStep = stepToDone[step] ?? 'claimDone';
      await startSign(
        txn,
        sig => {
          signedTxn.current = sig;
        },
        async () => {
          const hash = await broadcast(signedTxn.current!, txn);
          setTxHash(hash);
          setStep(doneStep);
        },
      );
    } catch (e: any) {
      logger.error('Everstake signing error', e as object);
      setError(
        e instanceof Error ? e : new Error(e?.message ?? 'Signing failed'),
      );
      setStep('error');
    }
  };

  useEffect(() => {
    if (SIGNING_STEPS.includes(step)) {
      startSigning();
    }
  }, [step]);

  const onProceed = async () => {
    try {
      if (mode === 'stake') await handleStakeFlow();
      else if (mode === 'unstake') await handleUnstakeFlow();
      else await handleClaimFlow();
    } catch (e: any) {
      logger.error('Everstake flow error', e as object);
      setError(
        e instanceof Error ? e : new Error(e?.message ?? 'An error occurred'),
      );
      setStep('error');
    }
  };

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
      amount,
      setAmount,
      stakeTxn,
      isFeeLoading,
      customGasPrice,
      setCustomGasPrice,
      unstakeAmount,
      setUnstakeAmount,
      unstakeTxn,
      claimTxn,
      txHash,
      deviceEvents,
      error,
      poolInfo,
      userPosition,
      withdrawRequest,
      dataLoading,
      minStakeAmount: poolInfo?.minStakeAmount ?? '0.01',
      onProceed,
      onClose,
    }),
    [
      mode,
      step,
      selectedWallet,
      selectedAccount,
      walletDropdownList,
      accountDropdownList,
      amount,
      stakeTxn,
      isFeeLoading,
      customGasPrice,
      unstakeAmount,
      unstakeTxn,
      claimTxn,
      txHash,
      deviceEvents,
      error,
      poolInfo,
      userPosition,
      withdrawRequest,
      dataLoading,
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
