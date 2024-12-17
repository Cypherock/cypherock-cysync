import { SignTransactionDeviceEvent } from '@cypherock/coin-support-interfaces';
import {
  makeSignTransactionsObservable,
  mapDerivationPath,
  SignTransactionFromDevice,
} from '@cypherock/coin-support-utils';
import { ISignTxnUnsignedTxn, StarknetApp } from '@cypherock/sdk-app-starknet';
import { assert, hexToUint8Array } from '@cypherock/sdk-utils';
import { Observable } from 'rxjs';

import {
  ISignStarknetTransactionParams,
  ISignStarknetTransactionEvent,
  signStarknetToDeviceEventMap,
} from './types';

import { STRK_TOKEN_CONTRACT } from '../../constants';
import * as services from '../../services';
import { createApp } from '../../utils';
import logger from '../../utils/logger';
import { IPreparedStarknetTransaction } from '../transaction';

const prepareTxnToSign = async (
  transaction: IPreparedStarknetTransaction,
  address: string,
): Promise<ISignTxnUnsignedTxn> => {
  const { address: recipientAddress, amount } = transaction.computedData.output;
  const { resourceBounds } = transaction.computedData.feeData;

  const calldata = services.getInvokeCalldata(
    STRK_TOKEN_CONTRACT,
    recipientAddress,
    amount,
  );

  return {
    invokeTxn: {
      senderAddress: hexToUint8Array(address),
      calldata: { value: calldata.map(item => hexToUint8Array(item)) },
      version: hexToUint8Array('0x3'),
      nonce: hexToUint8Array(transaction.staticData.nonce),
      chainId: hexToUint8Array('0x534e5f4d41494e'),
      tip: hexToUint8Array('0x0'),
      paymasterData: [],
      accountDeploymentData: [],
      nonceDataAvailabilityMode: hexToUint8Array('0x0'),
      feeDataAvailabilityMode: hexToUint8Array('0x0'),
      resourceBound: {
        level1: {
          maxAmount: hexToUint8Array(resourceBounds.l1_gas.max_amount),
          maxPricePerUnit: hexToUint8Array(
            resourceBounds.l1_gas.max_price_per_unit,
          ),
        },
        level2: {
          maxAmount: hexToUint8Array(resourceBounds.l2_gas.max_amount),
          maxPricePerUnit: hexToUint8Array(
            resourceBounds.l2_gas.max_price_per_unit,
          ),
        },
      },
    },
  };
};

const signTransactionFromDevice: SignTransactionFromDevice<
  StarknetApp,
  string
> = async params => {
  const { app, observer, transaction, account } = params;
  logger.info({ transaction });

  const events: Record<SignTransactionDeviceEvent, boolean | undefined> =
    {} as any;

  const txn = await prepareTxnToSign(
    transaction as IPreparedStarknetTransaction,
    account.xpubOrAddress,
  );

  assert(txn, 'Missing unsigned transaction');

  const { signature } = await app.signTxn({
    walletId: hexToUint8Array(account.walletId),
    derivationPath: mapDerivationPath(account.derivationPath),
    txn,
    onEvent: event => {
      const deviceEvent = signStarknetToDeviceEventMap[event];
      if (deviceEvent !== undefined) {
        events[deviceEvent] = true;
      }

      observer.next({ type: 'Device', device: { isDone: false, events } });
    },
  });

  observer.next({ type: 'Device', device: { isDone: true, events } });

  assert(signature, new Error('Failed to sign transaction'));

  return signature;
};

export const signTransaction = (
  params: ISignStarknetTransactionParams,
): Observable<ISignStarknetTransactionEvent> =>
  makeSignTransactionsObservable<
    StarknetApp,
    ISignStarknetTransactionEvent,
    string
  >({
    ...params,
    signTransactionFromDevice,
    createApp,
  });
