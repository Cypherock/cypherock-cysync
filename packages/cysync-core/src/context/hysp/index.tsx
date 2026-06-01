import { getCoinSupport } from '@cypherock/coin-support';
import {
  IPreparedEvmTransaction,
  prepareApproveDeposit,
  prepareDeposit,
  prepareApproveRedeem,
  prepareRedeemInstant,
  prepareRedeemQueue,
  HyspChain,
} from '@cypherock/coin-support-evm';
import { ISignTransactionEvent } from '@cypherock/coin-support-interfaces';
import { evmCoinList, EvmIdMap } from '@cypherock/coins';
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

import { deviceLock, useDevice } from '~/context';
import { useWalletDropdown, useAccountDropdown } from '~/hooks';
import { getDB } from '~/utils';
import logger from '~/utils/logger';

import {
  MEV_USD_ADDRESS,
  TOKEN_ADDRESSES,
  COIN_ID_TO_CHAIN,
} from '../../constants/hysp';
import * as hyspService from '../../services/hyspService';

// Types

export type HyspMode = 'deposit' | 'redeem';
export type RedeemPath = 'instant' | 'queue';

type HyspStep =
  | 'input'
  | 'approveFee'
  | 'approving'
  | 'polling'
  | 'depositFee'
  | 'depositing'
  | 'done'
  | 'redeem-input'
  | 'redeem-approve-fee'
  | 'redeem-approving'
  | 'redeem-polling'
  | 'redeem-fee'
  | 'redeeming'
  | 'redeem-done'
  | 'error';

interface IHyspContext {
  mode: HyspMode;
  setMode: (m: HyspMode) => void;
  step: HyspStep;
  selectedWallet: IWallet | undefined;
  selectedAccount: IAccount | undefined;
  walletDropdownList: any[];
  accountDropdownList: any[];
  handleWalletChange: (id?: string) => void;
  handleAccountChange: (id?: string) => void;
  // deposit
  selectedToken: 'usdc' | 'usdt';
  setSelectedToken: (t: 'usdc' | 'usdt') => void;
  amount: string;
  setAmount: (a: string) => void;
  approveTxn: IPreparedEvmTransaction | undefined;
  depositTxn: IPreparedEvmTransaction | undefined;
  // redeem
  redeemAmount: string;
  setRedeemAmount: (a: string) => void;
  redeemTokenOut: 'usdc' | 'usdt';
  setRedeemTokenOut: (t: 'usdc' | 'usdt') => void;
  userRedeemChoice: RedeemPath;
  setUserRedeemChoice: (p: RedeemPath) => void;
  instantAvailable: boolean;
  redeemPath: RedeemPath | undefined;
  redeemApproveTxn: IPreparedEvmTransaction | undefined;
  redeemTxn: IPreparedEvmTransaction | undefined;
  // shared
  deviceEvents: Record<number, boolean | undefined>;
  error: string | undefined;
  vaultInfo: hyspService.IHyspVaultInfo | undefined;
  position: hyspService.IHyspPosition | undefined;
  vaultInfoLoading: boolean;
  onProceed: () => Promise<void>;
  onClose: () => void;
}

const HyspContext: Context<IHyspContext> = createContext<IHyspContext>(
  {} as IHyspContext,
);

// Provider

export const HyspProvider: FC<{ children: ReactNode; onClose: () => void }> = ({
  children,
  onClose,
}) => {
  const { connection } = useDevice();

  const [mode, setModeState] = useState<HyspMode>('deposit');
  const [step, setStep] = useState<HyspStep>('input');

  // deposit
  const [selectedToken, setSelectedToken] = useState<'usdc' | 'usdt'>('usdc');
  const [amount, setAmount] = useState('');
  const [approveTxn, setApproveTxn] = useState<IPreparedEvmTransaction>();
  const [depositTxn, setDepositTxn] = useState<IPreparedEvmTransaction>();

  // redeem
  const [redeemAmount, setRedeemAmount] = useState('');
  const [redeemTokenOut, setRedeemTokenOut] = useState<'usdc' | 'usdt'>('usdc');
  const [userRedeemChoice, setUserRedeemChoice] =
    useState<RedeemPath>('instant');
  const [redeemPath, setRedeemPath] = useState<RedeemPath>();
  const [redeemApproveTxn, setRedeemApproveTxn] =
    useState<IPreparedEvmTransaction>();
  const [redeemTxn, setRedeemTxn] = useState<IPreparedEvmTransaction>();

  // shared
  const [deviceEvents, setDeviceEvents] = useState<
    Record<number, boolean | undefined>
  >({});
  const [error, setError] = useState<string>();
  const [vaultInfo, setVaultInfo] = useState<hyspService.IHyspVaultInfo>();
  const [position, setPosition] = useState<hyspService.IHyspPosition>();
  const [vaultInfoLoading, setVaultInfoLoading] = useState(false);

  // whether current redeemAmount fits within instant liquidity
  const instantAvailable = React.useMemo(() => {
    const num = parseFloat(redeemAmount);
    const liquidity = parseFloat(vaultInfo?.instantLiquidity ?? '0');
    return !!num && !!liquidity && num <= liquidity;
  }, [redeemAmount, vaultInfo?.instantLiquidity]);

  const flowSubscription = useRef<Subscription | undefined>();
  const signedApprove = useRef<string | undefined>();
  const signedAction = useRef<string | undefined>();

  const { selectedWallet, handleWalletChange, walletDropdownList } =
    useWalletDropdown();

  const { selectedAccount, handleAccountChange, accountDropdownList } =
    useAccountDropdown({
      selectedWallet,
      assetFilter: [EvmIdMap.ethereum, EvmIdMap.base],
    });

  // Vault info

  useEffect(() => {
    if (!selectedAccount) return;
    const chain = COIN_ID_TO_CHAIN[selectedAccount.assetId];
    if (!chain) return;
    setVaultInfoLoading(true);
    Promise.all([
      hyspService.getVaultInfo(chain),
      hyspService.getUserPosition(chain, selectedAccount.xpubOrAddress),
    ])
      .then(([info, pos]) => {
        setVaultInfo(info);
        setPosition(pos);
      })
      .catch(e => logger.error('HYSP vault info fetch failed', e as object))
      .finally(() => setVaultInfoLoading(false));
  }, [selectedAccount?.assetId, selectedAccount?.xpubOrAddress]);

  // Mode toggle

  const setMode = (m: HyspMode) => {
    setModeState(m);
    setStep(m === 'deposit' ? 'input' : 'redeem-input');
    setError(undefined);
    setDeviceEvents({});
    if (m === 'redeem') {
      setRedeemAmount('');
      setUserRedeemChoice('instant');
    }
    flowSubscription.current?.unsubscribe();
  };

  // Helpers

  const getChain = (): HyspChain => {
    const chain = COIN_ID_TO_CHAIN[selectedAccount?.assetId ?? ''];
    if (!chain) throw new Error('Unsupported chain for HYSP');
    return chain;
  };

  const getDepositTokenAddress = (): string => {
    const chain = getChain();
    const addr =
      selectedToken === 'usdt'
        ? TOKEN_ADDRESSES[chain].usdt
        : TOKEN_ADDRESSES[chain].usdc;
    if (!addr) throw new Error('Token not supported on this chain');
    return addr;
  };

  const getRedeemTokenOutAddress = (): string => {
    const chain = getChain();
    const addr =
      redeemTokenOut === 'usdt'
        ? TOKEN_ADDRESSES[chain].usdt
        : TOKEN_ADDRESSES[chain].usdc;
    if (!addr) throw new Error('Token not supported on this chain');
    return addr;
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

  const pollConfirmation = async (txHash: string): Promise<boolean> => {
    if (!txHash)
      throw new Error('Broadcast failed — no transaction hash returned');

    const { network } = evmCoinList[selectedAccount!.assetId];
    const deadline = Date.now() + 5 * 60 * 1000;
    while (Date.now() < deadline) {
      await new Promise<void>(r => {
        setTimeout(r, 4000);
      });
      try {
        const status = await hyspService.getEthTransactionStatus(
          txHash,
          network,
        );
        if (status === '1') return true;
        if (status === '0') return false;
      } catch (e) {
        logger.warn('HYSP polling error', e as object);
      }
    }
    return false;
  };

  const startSign = async (
    txn: IPreparedEvmTransaction,
    onSigned: (sig: string) => void,
    onDone: () => Promise<void>,
  ) => {
    if (!connection?.connection) throw new Error('Device not connected');
    const taskId = lodash.uniqueId('hysp-');
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
          setError(err?.message ?? 'Signing failed');
          setStep('error');
        },
        complete: () => {
          release();
          onDone().catch((err: any) => {
            const msg =
              err?.response?.data?.cysyncError ??
              err?.response?.data?.message ??
              err?.response?.data?.error ??
              err?.message ??
              'Broadcast failed';
            logger.error('HYSP post-sign error', err as object);
            setError(msg);
            setStep('error');
          });
        },
      });
  };

  const broadcast = async (
    signed: string,
    txn: IPreparedEvmTransaction,
  ): Promise<string> => {
    // No try/catch — let RPC failures propagate to onProceed's error handler
    const result = await coinSupport().broadcastTransaction({
      db: getDB(),
      signedTransaction: signed,
      transaction: txn,
    });
    return (result as any)?.hash ?? '';
  };

  // Deposit flow

  const handleDepositFlow = async () => {
    const chain = getChain();
    const tokenAddress = getDepositTokenAddress();
    const walletAddress = selectedAccount!.xpubOrAddress;
    const numAmount = parseFloat(amount);

    if (step === 'input') {
      const allowance = await hyspService.checkAllowance({
        chain,
        walletAddress,
        tokenAddress,
        vaultType: 'deposit',
        amount: numAmount,
      });
      const initTxn = await getInitTxn();
      if (!allowance.sufficient) {
        const prepared = await prepareApproveDeposit({
          accountId: selectedAccount!.__id ?? '',
          db: getDB(),
          txn: initTxn,
          chain,
          walletAddress,
          tokenAddress,
          amount: numAmount,
        });
        setApproveTxn(prepared);
        setStep('approveFee');
      } else {
        const prepared = await prepareDeposit({
          accountId: selectedAccount!.__id ?? '',
          db: getDB(),
          txn: initTxn,
          chain,
          walletAddress,
          tokenAddress,
          amount: numAmount,
        });
        setDepositTxn(prepared);
        setStep('depositFee');
      }
      return;
    }

    if (step === 'approveFee') {
      setStep('approving');
      await startSign(
        approveTxn!,
        sig => {
          signedApprove.current = sig;
        },
        async () => {
          const txHash = await broadcast(signedApprove.current!, approveTxn!);
          setStep('polling');
          const confirmed = await pollConfirmation(txHash);
          if (!confirmed) {
            setError('Approval transaction failed or timed out');
            setStep('error');
            return;
          }
          const initTxn2 = await getInitTxn();
          const prepared = await prepareDeposit({
            accountId: selectedAccount!.__id ?? '',
            db: getDB(),
            txn: initTxn2,
            chain,
            walletAddress,
            tokenAddress,
            amount: numAmount,
          });
          setDepositTxn(prepared);
          setStep('depositFee');
        },
      );
      return;
    }

    if (step === 'depositFee') {
      setStep('depositing');
      await startSign(
        depositTxn!,
        sig => {
          signedAction.current = sig;
        },
        async () => {
          await broadcast(signedAction.current!, depositTxn!);
          setStep('done');
        },
      );
    }
  };

  // Redeem flow

  const handleRedeemFlow = async () => {
    const chain = getChain();
    const walletAddress = selectedAccount!.xpubOrAddress;
    const numAmount = parseFloat(redeemAmount);
    const mevUsdAddress = MEV_USD_ADDRESS[chain];
    const tokenOutAddress = getRedeemTokenOutAddress();

    const resolveRedeemPath = (): RedeemPath => {
      const liquidity = parseFloat(vaultInfo?.instantLiquidity ?? '0');
      const canInstant = numAmount <= liquidity;
      if (!canInstant) return 'queue'; // force queue, insufficient instant liquidity
      return userRedeemChoice; // user's choice when both are available
    };

    if (step === 'redeem-input') {
      const path = resolveRedeemPath();
      setRedeemPath(path);

      const allowance = await hyspService.checkAllowance({
        chain,
        walletAddress,
        tokenAddress: mevUsdAddress,
        vaultType: 'redeem',
        amount: numAmount,
      });
      const initTxn = await getInitTxn();

      if (!allowance.sufficient) {
        const prepared = await prepareApproveRedeem({
          accountId: selectedAccount!.__id ?? '',
          db: getDB(),
          txn: initTxn,
          chain,
          walletAddress,
          amount: numAmount,
        });
        setRedeemApproveTxn(prepared);
        setStep('redeem-approve-fee');
      } else {
        const prepared =
          path === 'instant'
            ? await prepareRedeemInstant({
                accountId: selectedAccount!.__id ?? '',
                db: getDB(),
                txn: initTxn,
                chain,
                walletAddress,
                tokenOut: tokenOutAddress,
                amount: numAmount,
              })
            : await prepareRedeemQueue({
                accountId: selectedAccount!.__id ?? '',
                db: getDB(),
                txn: initTxn,
                chain,
                walletAddress,
                tokenOut: tokenOutAddress,
                amount: numAmount,
              });
        setRedeemTxn(prepared);
        setStep('redeem-fee');
      }
      return;
    }

    if (step === 'redeem-approve-fee') {
      setStep('redeem-approving');
      await startSign(
        redeemApproveTxn!,
        sig => {
          signedApprove.current = sig;
        },
        async () => {
          const txHash = await broadcast(
            signedApprove.current!,
            redeemApproveTxn!,
          );
          setStep('redeem-polling');
          const confirmed = await pollConfirmation(txHash);
          if (!confirmed) {
            setError('Approval transaction failed or timed out');
            setStep('error');
            return;
          }
          const path = redeemPath!;
          const initTxn2 = await getInitTxn();
          const prepared =
            path === 'instant'
              ? await prepareRedeemInstant({
                  accountId: selectedAccount!.__id ?? '',
                  db: getDB(),
                  txn: initTxn2,
                  chain,
                  walletAddress,
                  tokenOut: tokenOutAddress,
                  amount: numAmount,
                })
              : await prepareRedeemQueue({
                  accountId: selectedAccount!.__id ?? '',
                  db: getDB(),
                  txn: initTxn2,
                  chain,
                  walletAddress,
                  tokenOut: tokenOutAddress,
                  amount: numAmount,
                });
          setRedeemTxn(prepared);
          setStep('redeem-fee');
        },
      );
      return;
    }

    if (step === 'redeem-fee') {
      setStep('redeeming');
      await startSign(
        redeemTxn!,
        sig => {
          signedAction.current = sig;
        },
        async () => {
          await broadcast(signedAction.current!, redeemTxn!);
          setStep('redeem-done');
        },
      );
    }
  };

  // Main entry

  const onProceed = async () => {
    try {
      if (mode === 'deposit') {
        await handleDepositFlow();
      } else {
        await handleRedeemFlow();
      }
    } catch (e: any) {
      logger.error('HYSP flow error', e as object);
      setError(e?.message ?? 'An error occurred');
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
      selectedToken,
      setSelectedToken,
      amount,
      setAmount,
      approveTxn,
      depositTxn,
      redeemAmount,
      setRedeemAmount,
      redeemTokenOut,
      setRedeemTokenOut,
      userRedeemChoice,
      setUserRedeemChoice,
      instantAvailable,
      redeemPath,
      redeemApproveTxn,
      redeemTxn,
      deviceEvents,
      error,
      vaultInfo,
      position,
      vaultInfoLoading,
      onProceed,
      onClose,
    }),
    [
      mode,
      setMode,
      step,
      selectedWallet,
      selectedAccount,
      walletDropdownList,
      accountDropdownList,
      handleWalletChange,
      handleAccountChange,
      selectedToken,
      setSelectedToken,
      amount,
      setAmount,
      approveTxn,
      depositTxn,
      redeemAmount,
      setRedeemAmount,
      redeemTokenOut,
      setRedeemTokenOut,
      userRedeemChoice,
      setUserRedeemChoice,
      instantAvailable,
      redeemPath,
      redeemApproveTxn,
      redeemTxn,
      deviceEvents,
      error,
      vaultInfo,
      position,
      vaultInfoLoading,
      onProceed,
      onClose,
    ],
  );

  return (
    <HyspContext.Provider value={contextValue}>{children}</HyspContext.Provider>
  );
};

export const useHysp = () => useContext(HyspContext);
