import { SignTransactionDeviceEvent } from '@cypherock/coin-support-interfaces';
import {
  makeSignTransactionsObservable,
  mapDerivationPath,
  SignTransactionFromDevice,
} from '@cypherock/coin-support-utils';
import { starknetCoinList } from '@cypherock/coins';
import { IAccount } from '@cypherock/db-interfaces';
import { ISignTxnUnsignedTxn, StarknetApp } from '@cypherock/sdk-app-starknet';
import { assert, hexToUint8Array } from '@cypherock/sdk-utils';
import { Observable } from 'rxjs';

import {
  signStarknetDeployAccountToDeviceEventMap,
  ISignStarknetDeployAccountTransactionParams,
  ISignStarknetDeployAccountTransactionEvent,
  IPreparedStarknetDeployAccountTransaction,
} from './types';

import { getConstructorCalldata } from '../../services';
import { createApp } from '../../utils';
import logger from '../../utils/logger';

const prepareTxnToSign = async (
  transaction: IPreparedStarknetDeployAccountTransaction,
  account: IAccount,
): Promise<ISignTxnUnsignedTxn> => {
  const { resourceBounds } = transaction.computedData.feeData;

  const salt = account.extraData?.salt ?? 'salt';
  const calldata = getConstructorCalldata(salt);

  return {
    deployTxn: {
      contractAddress: hexToUint8Array(account.xpubOrAddress),
      constructorCallData: {
        value: calldata.map(item => hexToUint8Array(item)),
      },
      classHash: hexToUint8Array(
        starknetCoinList[account.assetId].argentXClassHash,
      ),
      salt: hexToUint8Array(salt),
      version: hexToUint8Array('0x3'),
      nonce: hexToUint8Array(transaction.computedData.nonce),
      chainId: hexToUint8Array(transaction.computedData.chainId),
      tip: hexToUint8Array('0x0'),
      paymasterData: [],
      nonceDataAvailabilityMode: hexToUint8Array('0x0'),
      feeDataAvailabilityMode: hexToUint8Array('0x0'),
      resourceBounds: {
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
    transaction as IPreparedStarknetDeployAccountTransaction,
    account,
  );

  assert(txn, 'Missing unsigned transaction');

  const { signature } = await app.signTxn({
    walletId: hexToUint8Array(account.walletId),
    derivationPath: mapDerivationPath(account.derivationPath),
    txn,
    onEvent: event => {
      const deviceEvent = signStarknetDeployAccountToDeviceEventMap[event];
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

export const signDeployAccountTransaction = (
  params: ISignStarknetDeployAccountTransactionParams,
): Observable<ISignStarknetDeployAccountTransactionEvent> =>
  makeSignTransactionsObservable<
    StarknetApp,
    ISignStarknetDeployAccountTransactionEvent,
    string
  >({
    ...params,
    signTransactionFromDevice,
    createApp,
  });
