/* eslint-disable no-bitwise, no-plusplus */
import { SignTransactionDeviceEvent } from '@cypherock/coin-support-interfaces';
import {
  makeSignTransactionsObservable,
  mapDerivationPath,
  SignTransactionFromDevice,
} from '@cypherock/coin-support-utils';
import { IAccount } from '@cypherock/db-interfaces';
import { SiaApp, IUnsignedTransaction } from '@cypherock/sdk-app-sia';
import { assert, hexToUint8Array } from '@cypherock/sdk-utils';
import { Observable } from 'rxjs';

import {
  ISignSiaTransactionParams,
  ISignSiaTransactionEvent,
  signSiaToDeviceEventMap,
} from './types';

import { createApp, scToHastings, hexToBytes } from '../../utils';
import { IPreparedSiaTransaction } from '../transaction';

const serializeTransactionBlob = (
  selectedUTXOs: Array<{ id: string; value: string }>,
  outputs: Array<{ address: string; value: string }>,
  fee: string,
): string => {
  const buffer: number[] = [];

  const BIGINT_FF = BigInt(255);
  const BIGINT_64 = BigInt(64);
  const BIGINT_FFFFFFFFFFFFFFFF = BigInt('0xFFFFFFFFFFFFFFFF');

  // 1. Input count (8 bytes LE)
  const inputCount = BigInt(selectedUTXOs.length);
  for (let i = 0; i < 8; i++) {
    buffer.push(Number((inputCount >> BigInt(i * 8)) & BIGINT_FF));
  }

  // 2. Parent IDs (32 bytes each)
  for (const utxo of selectedUTXOs) {
    const parentBytes = hexToBytes(utxo.id);
    buffer.push(...parentBytes);
  }

  // 3. Output count (8 bytes LE)
  const outputCount = BigInt(outputs.length);
  for (let i = 0; i < 8; i++) {
    buffer.push(Number((outputCount >> BigInt(i * 8)) & BIGINT_FF));
  }

  // 4. Outputs (32 + 16 bytes each)
  for (const output of outputs) {
    // Address hash (first 64 chars = 32 bytes)
    const addrBytes = hexToBytes(output.address.substring(0, 64));
    buffer.push(...addrBytes);

    // Value as V2Currency (lo + hi, both 8 bytes LE)
    const hastingsValue = BigInt(output.value);
    const lo = hastingsValue & BIGINT_FFFFFFFFFFFFFFFF;
    const hi = hastingsValue >> BIGINT_64;

    // Value lo (8 bytes LE)
    for (let i = 0; i < 8; i++) {
      buffer.push(Number((lo >> BigInt(i * 8)) & BIGINT_FF));
    }
    // Value hi (8 bytes LE)
    for (let i = 0; i < 8; i++) {
      buffer.push(Number((hi >> BigInt(i * 8)) & BIGINT_FF));
    }
  }

  // 5. Fee (16 bytes LE: lo + hi)
  const hastingsFee = BigInt(fee);
  const feeLo = hastingsFee & BIGINT_FFFFFFFFFFFFFFFF;
  const feeHi = hastingsFee >> BIGINT_64;

  // Fee lo (8 bytes LE)
  for (let i = 0; i < 8; i++) {
    buffer.push(Number((feeLo >> BigInt(i * 8)) & BIGINT_FF));
  }
  // Fee hi (8 bytes LE)
  for (let i = 0; i < 8; i++) {
    buffer.push(Number((feeHi >> BigInt(i * 8)) & BIGINT_FF));
  }

  return buffer.map(b => b.toString(16).padStart(2, '0')).join('');
};

const prepareUnsignedTxn = async (
  transaction: IPreparedSiaTransaction,
  account: IAccount,
): Promise<IUnsignedTransaction> => {
  const { selectedUtxos, output, fees, changeAmount } =
    transaction.computedData;

  const sendAmountHastings = BigInt(scToHastings(output.amount));
  const feeHastings = BigInt(scToHastings(fees));

  const outputs: Array<{ address: string; value: string }> = [
    {
      address: output.address,
      value: sendAmountHastings.toString(),
    },
  ];

  const changeHastings = BigInt(changeAmount);

  if (changeHastings > BigInt(0)) {
    outputs.push({
      address: account.xpubOrAddress,
      value: changeHastings.toString(),
    });
  }

  const blob = serializeTransactionBlob(
    selectedUtxos,
    outputs,
    feeHastings.toString(),
  );

  return { blob };
};

const signTransactionFromDevice: SignTransactionFromDevice<
  SiaApp,
  string
> = async params => {
  const { app, observer, transaction, account } = params;

  const events: Record<SignTransactionDeviceEvent, boolean | undefined> =
    {} as any;

  const txn = await prepareUnsignedTxn(
    transaction as IPreparedSiaTransaction,
    account,
  );

  assert(txn, 'Missing unsigned transaction');

  const { signature } = await app.signTxn({
    walletId: hexToUint8Array(account.walletId),
    derivationPath: mapDerivationPath(account.derivationPath),
    txn,
    onEvent: event => {
      const deviceEvent = signSiaToDeviceEventMap[event];
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
  params: ISignSiaTransactionParams,
): Observable<ISignSiaTransactionEvent> =>
  makeSignTransactionsObservable<SiaApp, ISignSiaTransactionEvent, string>({
    ...params,
    signTransactionFromDevice,
    createApp,
  });
