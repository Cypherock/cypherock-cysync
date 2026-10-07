import { SignTransactionDeviceEvent } from '@cypherock/coin-support-interfaces';
import { mapDerivationPath } from '@cypherock/coin-support-utils';
import { IAccount } from '@cypherock/db-interfaces';
import { SignTxnEvent, SolanaApp } from '@cypherock/sdk-app-solana';
import { hexToUint8Array } from '@cypherock/sdk-utils';
import lodash from 'lodash';
import { useCallback, useEffect, useRef, useState } from 'react';

import { syncAccounts } from '~/actions';
import { deviceLock, useDevice, useCurrency } from '~/context';
import * as everstakeSolService from '~/services/everstakeSolService';
import { useAppDispatch } from '~/store';
import logger from '~/utils/logger';

import { SolEverstakeStep } from './types';

const signSolanaToDeviceEventMap: Partial<
  Record<SignTxnEvent, SignTransactionDeviceEvent>
> = {
  [SignTxnEvent.INIT]: SignTransactionDeviceEvent.INIT,
  [SignTxnEvent.CONFIRM]: SignTransactionDeviceEvent.CONFIRMED,
  [SignTxnEvent.VERIFY]: SignTransactionDeviceEvent.VERIFIED,
  [SignTxnEvent.PASSPHRASE]: SignTransactionDeviceEvent.PASSPHRASE_ENTERED,
  [SignTxnEvent.PIN_CARD]: SignTransactionDeviceEvent.CARD_TAPPED,
};

export const useSolSigning = (params: {
  selectedAccount: IAccount | undefined;
  step: SolEverstakeStep;
  signingSteps: SolEverstakeStep[];
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

  // Hex of the compiled message to sign, set by the provider before moving
  // to a signing step
  const pendingTxHexRef = useRef<string | undefined>();
  const appRef = useRef<SolanaApp | undefined>();
  const cancelledRef = useRef(false);

  const startSigning = async () => {
    const unsignedTxHex = pendingTxHexRef.current;
    if (!unsignedTxHex || !selectedAccount || !connection?.connection) return;

    const account = selectedAccount;
    const signingStep = step;
    const taskId = lodash.uniqueId('everstake-sol-');
    cancelledRef.current = false;

    let lockAcquired = false;
    try {
      await deviceLock.acquire(connection.device, taskId);
      lockAcquired = true;
      setDeviceEvents({});

      const events: Record<number, boolean | undefined> = {};
      const app = await SolanaApp.create(connection.connection);
      appRef.current = app;

      const { serializedTxn } = await app.signTxn({
        walletId: hexToUint8Array(account.walletId),
        derivationPath: mapDerivationPath(account.derivationPath),
        txn: unsignedTxHex,
        serializeTxn: true,
        // getLatestBlockHash: () =>
        //   everstakeSolService.getLatestBlockhash(account.assetId),
        onEvent: event => {
          const deviceEvent = signSolanaToDeviceEventMap[event];
          if (deviceEvent !== undefined) {
            events[deviceEvent] = true;
            setDeviceEvents({ ...events });
          }
        },
      });

      if (!serializedTxn) throw new Error('Failed to sign transaction');

      const hash = await everstakeSolService.broadcastSignedTransaction(
        serializedTxn,
        account.assetId,
      );

      dispatch(
        syncAccounts({
          accounts: [account],
          currency: currentCurrency,
        }),
      );
      refreshPosition(account).catch((e: any) =>
        logger.error(
          'Everstake SOL post-broadcast position refresh failed',
          e as object,
        ),
      );

      onSigningCompleteRef.current(signingStep, hash);
    } catch (e: any) {
      if (cancelledRef.current) return;
      logger.error('Everstake SOL signing error', e as object);
      const msg =
        e?.response?.data?.message ??
        e?.message ??
        'Signing or broadcast failed';
      onSigningErrorRef.current(e instanceof Error ? e : new Error(msg));
    } finally {
      appRef.current = undefined;
      if (lockAcquired) deviceLock.release(connection.device, taskId);
    }
  };

  const signingStartedForStep = useRef<SolEverstakeStep | undefined>();

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
    cancelledRef.current = true;
    appRef.current?.abort().catch((e: any) => {
      logger.warn('Everstake SOL: error aborting sign');
      logger.warn(e);
    });
  }, []);

  return { pendingTxHexRef, deviceEvents, cancelSigning };
};
