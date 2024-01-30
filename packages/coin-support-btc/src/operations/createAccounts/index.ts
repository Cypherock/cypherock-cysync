import { CreateAccountDeviceEvent } from '@cypherock/coin-support-interfaces';
import {
  GetAddressesFromDevice,
  IMakeCreateAccountsObservableParams,
  makeCreateAccountsObservable,
} from '@cypherock/coin-support-utils';
import { btcCoinList } from '@cypherock/coins';
import { AccountTypeMap } from '@cypherock/db-interfaces';
import { BtcApp } from '@cypherock/sdk-app-btc';
import { hexToUint8Array } from '@cypherock/sdk-utils';
import { Observable } from 'rxjs';

import { createDerivationPathSchemes } from './schemes';
import {
  ICreateBtcAccountEvent,
  ICreateBtcAccountParams,
  btcToDeviceEventMap,
} from './types';

import * as services from '../../services';
import { createApp } from '../../utils';

const DERIVATION_PATH_LIMIT = 30;

const getAddressesFromDevice: GetAddressesFromDevice<BtcApp> = async params => {
  const { app, walletId, derivationPaths, observer } = params;

  const events: Record<CreateAccountDeviceEvent, boolean | undefined> =
    {} as any;

  const { xpubs } = await app.getXpubs({
    walletId: hexToUint8Array(walletId),
    derivationPaths: derivationPaths.map(e => ({ path: e.derivationPath })),
    onEvent: event => {
      const deviceEvent = btcToDeviceEventMap[event];
      if (deviceEvent !== undefined) {
        events[deviceEvent] = true;
      }

      observer.next({ type: 'Device', device: { isDone: false, events } });
    },
  });

  observer.next({ type: 'Device', device: { isDone: true, events } });

  return xpubs;
};

const createAccountFromAddress: IMakeCreateAccountsObservableParams<BtcApp>['createAccountFromAddress'] =
  async (addressDetails, params) => {
    const coin = btcCoinList[params.coinId];
    const name = `${coin.name} ${addressDetails.index + 1}`;

    return {
      name,
      xpubOrAddress: addressDetails.address,
      balance: addressDetails.balance,
      unit: coin.units[0].abbr,
      derivationPath: addressDetails.derivationPath,
      type: AccountTypeMap.account,
      familyId: coin.family,
      assetId: params.coinId,
      parentAssetId: params.coinId,
      walletId: params.walletId,
      derivationScheme: addressDetails.schemeName,
      isNew: addressDetails.txnCount <= 0,
      isHidden: false,
    };
  };

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
  makeCreateAccountsObservable<BtcApp, ICreateBtcAccountEvent>({
    ...params,
    createAccountFromAddress,
    getBalanceAndTxnCount,
    getAddressesFromDevice,
    createApp,
    derivationPathSchemes: createDerivationPathSchemes(params.coinId),
    derivationPathLimit: DERIVATION_PATH_LIMIT,
  });
