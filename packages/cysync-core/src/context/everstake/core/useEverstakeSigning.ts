import { getCoinSupport } from '@cypherock/coin-support';
import { IPreparedEvmTransaction } from '@cypherock/coin-support-evm';
import { ISignTransactionEvent } from '@cypherock/coin-support-interfaces';
import { BigNumber } from '@cypherock/cysync-utils';
import { IAccount } from '@cypherock/db-interfaces';
import lodash from 'lodash';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Subscription } from 'rxjs';

import { syncAccounts } from '~/actions';
import { deviceLock, useDevice, useCurrency } from '~/context';
import * as everstakeService from '~/services/everstakeEthService';
import * as everstakePolService from '~/services/everstakePolService';
import { useAppDispatch } from '~/store';
import { getDB } from '~/utils';
import logger from '~/utils/logger';

import { EverstakeStep } from './types';

export const useEverstakeSigning = (params: {
  selectedAccount: IAccount | undefined;
  step: EverstakeStep;
  signingSteps: EverstakeStep[];
  onSigningComplete: (completedStep: string, txHash: string) => void;
  onSigningError: (err: Error) => void;
  refreshPosition: (account: IAccount) => Promise<void>;
}) => {
  const { selectedAccount, step, signingSteps, refreshPosition } = params;
  const onSigningCompleteRef = useRef(params.onSigningComplete);
  onSigningCompleteRef.current = params.onSigningComplete;
  const onSigningErrorRef = useRef(params.onSigningError);
  onSigningErrorRef.current = params.onSigningError;

  const { connection } = useDevice();
  const dispatch = useAppDispatch();
  const { currentCurrency } = useCurrency();

  const [deviceEvents, setDeviceEvents] = useState<
    Record<number, boolean | undefined>
  >({});
  const [txHash, setTxHash] = useState<string | undefined>();

  const flowSubscription = useRef<Subscription | undefined>();
  const signedTxn = useRef<string | undefined>();
  const pendingTxnRef = useRef<IPreparedEvmTransaction | undefined>();

  const coinSupport = useCallback(() => {
    if (!selectedAccount) throw new Error('No account selected');
    return getCoinSupport(selectedAccount.familyId);
  }, [selectedAccount]);

  const getInitTxn = useCallback(async (): Promise<IPreparedEvmTransaction> => {
    if (!selectedAccount) throw new Error('No account selected');
    return (await coinSupport().initializeTransaction({
      db: getDB(),
      accountId: selectedAccount.__id ?? '',
    })) as IPreparedEvmTransaction;
  }, [coinSupport, selectedAccount]);

  const applyCustomGas = useCallback(
    (
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
    },
    [],
  );

  const buildEverstakeTxn = useCallback(
    async (
      serverTxParams:
        | everstakeService.IEverstakeTxParams
        | everstakePolService.IEverstakePolTxParams,
    ): Promise<IPreparedEvmTransaction> => {
      const initTxn = await getInitTxn();
      return {
        ...initTxn,
        userInputs: {
          ...initTxn.userInputs,
          outputs: [
            { address: serverTxParams.to, amount: serverTxParams.value },
          ],
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
    },
    [getInitTxn],
  );

  const startSign = async (
    txn: IPreparedEvmTransaction,
    onSigned: (sig: string) => void,
    onDone: () => Promise<void>,
  ) => {
    if (!connection?.connection) return;
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
          onSigningErrorRef.current(
            err instanceof Error
              ? err
              : new Error(err?.message ?? 'Signing failed'),
          );
        },
        complete: () => {
          release();
          onDone().catch((err: any) => {
            const msg =
              err?.response?.data?.message ??
              err?.message ??
              'Broadcast failed';
            logger.error('Everstake post-sign error', err as object);
            onSigningErrorRef.current(
              err instanceof Error ? err : new Error(msg),
            );
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
      refreshPosition(selectedAccount).catch((e: any) =>
        logger.error(
          'Everstake post-broadcast position refresh failed',
          e as object,
        ),
      );
    }
    return (result as any)?.hash ?? '';
  };

  const startSigning = async () => {
    try {
      const txn = pendingTxnRef.current;
      if (!txn) return;
      const signingStep = step;
      await startSign(
        txn,
        sig => {
          signedTxn.current = sig;
        },
        async () => {
          const hash = await broadcast(signedTxn.current!, txn);
          onSigningCompleteRef.current(signingStep, hash);
        },
      );
    } catch (e: any) {
      logger.error('Everstake signing error', e as object);
      onSigningErrorRef.current(
        e instanceof Error ? e : new Error(e?.message ?? 'Signing failed'),
      );
    }
  };

  const signingStartedForStep = useRef<EverstakeStep | undefined>();

  useEffect(() => {
    if (!signingSteps.includes(step)) {
      signingStartedForStep.current = undefined;
      return;
    }
    if (!connection?.connection) return;
    if (signingStartedForStep.current === step) return;
    signingStartedForStep.current = step;
    startSigning();
  }, [step, connection?.connection]);

  const cancelSigning = useCallback(() => {
    flowSubscription.current?.unsubscribe();
  }, []);

  return {
    coinSupport,
    getInitTxn,
    applyCustomGas,
    buildEverstakeTxn,
    pendingTxnRef,
    deviceEvents,
    txHash,
    setTxHash,
    cancelSigning,
  };
};
