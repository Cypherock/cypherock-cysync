import {
  GetAddressesFromDevice,
  createAccountsObservable,
  ICreateAccountsObservableParams,
} from '@cypherock/coin-support-utils';
import { btcCoinList } from '@cypherock/coins';
import { BtcApp, GetXpubsStatus } from '@cypherock/sdk-app-btc';
import { IDeviceConnection } from '@cypherock/sdk-interfaces';
import { hexToUint8Array } from '@cypherock/sdk-utils';
import { Observable } from 'rxjs';

import { createDerivationPathSchemes } from './schemes';
import { ICreateBtcAccountParams, ICreateBtcAccountEvent } from './types';

import * as services from '../../services';

const DERIVATION_PATH_LIMIT = 50;

const getAddressesFromDevice: GetAddressesFromDevice<BtcApp> = async params => {
  const { app, walletId, derivationPaths, observer } = params;

  const events: Record<GetXpubsStatus, boolean | undefined> = {} as any;

  const { xpubs } = await app.getXpubs({
    walletId: hexToUint8Array(walletId),
    derivationPaths: derivationPaths.map(e => ({ path: e.derivationPath })),
    onEvent: event => {
      events[event] = true;
      observer.next({ type: 'Device', device: { isDone: false, events } });
    },
  });

  observer.next({ type: 'Device', device: { isDone: true, events } });

  return xpubs;
};

const createAccountFromAddress: ICreateAccountsObservableParams<BtcApp>['createAccountFromAddress'] =
  async (addressDetails, params) => {
    const coin = btcCoinList[params.coinId];
    const name = `${coin.name} ${addressDetails.index + 1}`;

    return {
      // TODO: name to be decided later
      name,
      xpubOrAddress: addressDetails.address,
      balance: addressDetails.balance,
      unit: coin.units[0].abbr.toLowerCase(),
      derivationPath: addressDetails.derivationPath,
      type: 'account',
      familyId: coin.family,
      assetId: params.coinId,
      walletId: params.walletId,
      derivationScheme: addressDetails.schemeName,
    };
  };

const createApp = (connection: IDeviceConnection) => BtcApp.create(connection);

const getBalanceAndTxnCount = async (
  address: string,
  params: ICreateBtcAccountParams,
) => {
  const result = await services.getXpubDetails({
    xpub: address,
    coinId: params.coinId,
    page: 1,
  });

  return {
    balance: result.balance,
    txnCount: result.txs,
  };
};

export const createAccounts = (
  params: ICreateBtcAccountParams,
): Observable<ICreateBtcAccountEvent> =>
  createAccountsObservable<BtcApp, ICreateBtcAccountEvent>({
    ...params,
    createAccountFromAddress,
    getBalanceAndTxnCount,
    getAddressesFromDevice,
    createApp,
    derivationPathSchemes: createDerivationPathSchemes(params.coinId),
    derivationPathLimit: DERIVATION_PATH_LIMIT,
  });
