import { SignTransactionDeviceEvent } from '@cypherock/coin-support-interfaces';
import {
  makeSignTransactionsObservable,
  mapDerivationPath,
  SignTransactionFromDevice,
} from '@cypherock/coin-support-utils';
import { IStarknetCoinInfo } from '@cypherock/coins';
import { IAccount } from '@cypherock/db-interfaces';
import { StarknetApp, ISignTxnParams } from '@cypherock/sdk-app-starknet';
import { assert, hexToUint8Array } from '@cypherock/sdk-utils';
import { Observable } from 'rxjs';

import {
  ISignStarknetTransactionParams,
  ISignStarknetTransactionEvent,
  signStarknetToDeviceEventMap,
} from './types';

import { createApp } from '../../utils';
import logger from '../../utils/logger';
import { IPreparedStarknetTransaction } from '../transaction';
import { getStarknetApiJs } from '@cypherock/sdk-app-starknet/dist/utils';
import { BigNumber } from '@cypherock/cysync-utils';
import { config } from '../../config';

const contractAXclassHash =
  '0x01a736d6ed154502257f02b1ccdf4d9d1089f80811cd6acad48e6b6a9d1f2003';
const ethContractAddress =
  '0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7';
// const strkContractAddress =
//   '0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d';

const nodeUrl = `https://starknet-goerli.infura.io/v3/${config.INFURA_STARKNET_API_KEY}`;
let provider: any = null;

const prepareUnsignedTxn = async (
  transaction: IPreparedStarknetTransaction,
  coin: IStarknetCoinInfo,
  account: IAccount,
): Promise<ISignTxnParams['txn']> => {
  assert(coin, new Error('Failed to prepare unsigned transaction'));
  assert(account, new Error('Failed to prepare unsigned transaction'));
  const txn: { unsignedSerialized: string | undefined } = {
    unsignedSerialized: undefined,
  };
  assert(
    account.extraData,
    new Error('Starknet salt not found. Reset db and add account again'),
  );
  assert(
    account.extraData.salt,
    new Error('Starknet salt not found. Reset db and add account again'),
  );
  const starknetjs = getStarknetApiJs();
  if (transaction.userInputs.txnType === 'deploy') {
    const constructorAXCallData = starknetjs.CallData.compile([
      account.extraData.salt,
      0,
    ]);
    const deployAccountTxnHash =
      starknetjs.hash.calculateDeployAccountTransactionHash(
        account.xpubOrAddress,
        contractAXclassHash,
        constructorAXCallData,
        account.extraData.salt,
        1,
        new BigNumber(transaction.computedData.maxFee, 16).toNumber(),
        starknetjs.constants.StarknetChainId.SN_GOERLI,
        0,
      );
    txn.unsignedSerialized = `${deployAccountTxnHash}`;
  } else if (transaction.userInputs.txnType === 'transfer') {
    const recipientAddress = transaction.userInputs.outputs[0].address;
    const maxFee = new BigNumber(transaction.computedData.maxFee).toNumber();
    const { amount } = transaction.userInputs.outputs[0];

    const txnVersion = '0x1';
    const transferCallData = [
      txnVersion,
      ethContractAddress,
      starknetjs.hash.getSelectorFromName('transfer'),
      '0x3',
      recipientAddress,
      amount,
      '0x0',
    ];
    if (!provider) {
      provider = new (getStarknetApiJs().RpcProvider)({ nodeUrl });
    }
    const transferFundTxnHash = starknetjs.hash.calculateTransactionHash(
      account.xpubOrAddress,
      txnVersion,
      transferCallData,
      maxFee,
      starknetjs.constants.StarknetChainId.SN_GOERLI,
      await provider.getNonceForAddress(account.xpubOrAddress),
    );
    txn.unsignedSerialized = `${transferFundTxnHash}`;
  } else {
    txn.unsignedSerialized = '';
  }
  assert(
    txn.unsignedSerialized,
    new Error('Failed to prepare unsigned transaction'),
  );

  return txn.unsignedSerialized;
};

const signTransactionFromDevice: SignTransactionFromDevice<
  StarknetApp
> = async params => {
  const { app, observer, transaction, account, coin } = params;
  logger.info({ transaction });

  const events: Record<SignTransactionDeviceEvent, boolean | undefined> =
    {} as any;

  const txn = await prepareUnsignedTxn(
    transaction as IPreparedStarknetTransaction,
    coin as IStarknetCoinInfo,
    account,
  );
  const { serializedTxn } = await app.signTxn({
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

  assert(serializedTxn, new Error('Failed to sign transaction'));

  return serializedTxn;
};

export const signTransaction = (
  params: ISignStarknetTransactionParams,
): Observable<ISignStarknetTransactionEvent> =>
  makeSignTransactionsObservable<StarknetApp, ISignStarknetTransactionEvent>({
    ...params,
    signTransactionFromDevice,
    createApp,
  });
