import {
  GetAddressesFromDevice,
  createAccountsObservable,
  ICreateAccountsObservableParams,
} from '@cypherock/coin-support-utils';
import { evmCoinList } from '@cypherock/coins';
import { EvmApp, GetPublicKeysStatus } from '@cypherock/sdk-app-evm';
import { IDeviceConnection } from '@cypherock/sdk-interfaces';
import { hexToUint8Array } from '@cypherock/sdk-utils';
import { Observable } from 'rxjs';

import { derivationPathSchemes } from './schemes';
import { ICreateEvmAccountParams, ICreateEvmAccountEvent } from './types';

import * as services from '../../services';

const DERIVATION_PATH_LIMIT = 50;

const getAddressesFromDevice: GetAddressesFromDevice<EvmApp> = async params => {
  const { app, walletId, coinId, derivationPaths, observer } = params;

  const events: Record<GetPublicKeysStatus, boolean | undefined> = {} as any;

  const { publicKeys } = await app.getPublicKeys({
    walletId: hexToUint8Array(walletId),
    derivationPaths: derivationPaths as any,
    chainId: evmCoinList[coinId].chain,
    onEvent: event => {
      events[event] = true;
      observer.next({ type: 'Device', device: { isDone: false, events } });
    },
  });

  observer.next({ type: 'Device', device: { isDone: true, events } });

  return publicKeys;
};

const createAccountFromAddress: ICreateAccountsObservableParams<EvmApp>['createAccountFromAddress'] =
  async (addressDetails, params) => ({
    // TODO: name to be decided later
    name: '',
    xpubOrAddress: addressDetails.address,
    balance: addressDetails.balance,
    unit: evmCoinList[params.coinId].units[0].abbr.toLowerCase(),
    derivationPath: addressDetails.derivationPath,
    type: 'account',
    familyId: params.coinId,
    assetId: params.coinId,
    walletId: params.walletId,
    extraData: {
      derivationScheme: addressDetails.schemeName,
    },
  });

const createApp = async (connection: IDeviceConnection) =>
  EvmApp.create(connection);

const getBalanceAndTxnCount = async (
  address: string,
  params: ICreateEvmAccountParams,
) => ({
  balance: await services.getBalance(address, params.coinId),
  txnCount: await services.getTransactionCount(address, params.coinId),
});

export const createAccounts = (
  params: ICreateEvmAccountParams,
): Observable<ICreateEvmAccountEvent> =>
  createAccountsObservable<EvmApp, ICreateEvmAccountEvent>({
    ...params,
    createAccountFromAddress,
    getBalanceAndTxnCount,
    getAddressesFromDevice,
    createApp,
    derivationPathSchemes,
    derivationPathLimit: DERIVATION_PATH_LIMIT,
  });
