import { CreateAccountDeviceEvent } from '@cypherock/coin-support-interfaces';
import {
  GetAddressesFromDevice,
  IMakeCreateAccountsObservableParams,
  makeCreateAccountsObservable,
} from '@cypherock/coin-support-utils';
import { xrpCoinList } from '@cypherock/coins';
import { AccountTypeMap } from '@cypherock/db-interfaces';
import { GetPublicKeysEvent, XrpApp } from '@cypherock/sdk-app-xrp';
import { hexToUint8Array } from '@cypherock/sdk-utils';
import { Observable } from 'rxjs';

import { derivationPathSchemes } from './schemes';
import {
  ICreateXrpAccountEvent,
  ICreateXrpAccountParams,
  ICreatedXrpAccount,
} from './types';

import * as services from '../../services';
import { createApp, deriveAddress } from '../../utils';

const DERIVATION_PATH_LIMIT = 30;

const getAddressesFromDevice: GetAddressesFromDevice<XrpApp> = async params => {
  const { app, walletId, derivationPaths, observer } = params;

  const events: Record<CreateAccountDeviceEvent, boolean | undefined> =
    {} as any;

  const xrpToDeviceEventMap: Partial<
    Record<GetPublicKeysEvent, CreateAccountDeviceEvent | undefined>
  > = {
    [GetPublicKeysEvent.INIT]: CreateAccountDeviceEvent.INIT,
    [GetPublicKeysEvent.CONFIRM]: CreateAccountDeviceEvent.CONFIRMED,
    [GetPublicKeysEvent.PASSPHRASE]:
      CreateAccountDeviceEvent.PASSPHRASE_ENTERED,
    [GetPublicKeysEvent.PIN_CARD]: CreateAccountDeviceEvent.CARD_TAPPED,
  };

  const { publicKeys } = await app.getPublicKeys({
    walletId: hexToUint8Array(walletId),
    derivationPaths: derivationPaths.map(e => ({ path: e.derivationPath })),
    onEvent: event => {
      const deviceEvent = xrpToDeviceEventMap[event];
      if (deviceEvent !== undefined) {
        events[deviceEvent] = true;
      }

      observer.next({ type: 'Device', device: { isDone: false, events } });
    },
  });

  observer.next({ type: 'Device', device: { isDone: true, events } });

  return publicKeys;
};

const createAccountFromAddress: IMakeCreateAccountsObservableParams<XrpApp>['createAccountFromAddress'] =
  async (addressDetails, params) => {
    const coin = xrpCoinList[params.coinId];
    const name = `${coin.name} ${addressDetails.index + 1}`;

    const account: ICreatedXrpAccount = {
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
      derivationScheme: addressDetails.schemeName as any,
      isNew: addressDetails.txnCount <= 0,
      extraData: {},
      isHidden: false,
    };

    return account;
  };

const getBalanceAndTxnCount = async (
  publicKey: string,
  params: ICreateXrpAccountParams,
) => {
  const address = deriveAddress(publicKey);
  return {
    balance: await services.getBalance(address, params.coinId),
    txnCount: (
      await services.getTransactions({
        address,
        assetId: params.coinId,
        limit: 1,
        binary: true,
      })
    ).transactions.length,
  };
};

export const createAccounts = (
  params: ICreateXrpAccountParams,
): Observable<ICreateXrpAccountEvent> =>
  makeCreateAccountsObservable<XrpApp, ICreateXrpAccountEvent>({
    ...params,
    createAccountFromAddress,
    getBalanceAndTxnCount,
    getAddressesFromDevice,
    createApp,
    derivationPathSchemes,
    derivationPathLimit: DERIVATION_PATH_LIMIT,
  });
