import { CreateAccountDeviceEvent } from '@cypherock/coin-support-interfaces';
import {
  GetAddressesFromDevice,
  IMakeCreateAccountsObservableParams,
  makeCreateAccountsObservable,
} from '@cypherock/coin-support-utils';
import { icpCoinList } from '@cypherock/coins';
import { AccountTypeMap } from '@cypherock/db-interfaces';
import { GetPublicKeysEvent, IcpApp } from '@cypherock/sdk-app-icp';
import { hexToUint8Array } from '@cypherock/sdk-utils';
import { Observable } from 'rxjs';

import { derivationPathSchemes } from './schemes';
import {
  ICreateIcpAccountEvent,
  ICreateIcpAccountParams,
  ICreatedIcpAccount,
} from './types';

import * as services from '../../services';
import { createApp, deriveAddress } from '../../utils';

const DERIVATION_PATH_LIMIT = 30;

const getAddressesFromDevice: GetAddressesFromDevice<IcpApp> = async params => {
  const { app, walletId, derivationPaths, observer } = params;

  const events: Record<CreateAccountDeviceEvent, boolean | undefined> =
    {} as any;

  const icpToDeviceEventMap: Partial<
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
      const deviceEvent = icpToDeviceEventMap[event];
      if (deviceEvent !== undefined) {
        events[deviceEvent] = true;
      }

      observer.next({ type: 'Device', device: { isDone: false, events } });
    },
  });

  observer.next({ type: 'Device', device: { isDone: true, events } });

  return publicKeys;
};

const createAccountFromAddress: IMakeCreateAccountsObservableParams<IcpApp>['createAccountFromAddress'] =
  async (addressDetails, params) => {
    const {
      address: publicKey,
      index,
      balance,
      txnCount,
      derivationPath,
      schemeName,
    } = addressDetails;
    const { coinId, walletId } = params;

    const coin = icpCoinList[coinId];
    const name = `${coin.name} ${index + 1}`;

    const account: ICreatedIcpAccount = {
      name,
      xpubOrAddress: deriveAddress(publicKey),
      balance,
      unit: coin.units[0].abbr,
      derivationPath,
      type: AccountTypeMap.account,
      familyId: coin.family,
      assetId: coinId,
      parentAssetId: coinId,
      walletId,
      derivationScheme: schemeName as any,
      isNew: txnCount <= 0,
      extraData: { publicKey },
      isHidden: false,
    };

    return account;
  };

const getBalanceAndTxnCount = async (publicKey: string) => {
  const address = deriveAddress(publicKey);
  return {
    balance: await services.getBalance(address),
    txnCount: (await services.getTransactions(address, 1)).count,
  };
};

export const createAccounts = (
  params: ICreateIcpAccountParams,
): Observable<ICreateIcpAccountEvent> =>
  makeCreateAccountsObservable<IcpApp, ICreateIcpAccountEvent>({
    ...params,
    createAccountFromAddress,
    getBalanceAndTxnCount,
    getAddressesFromDevice,
    createApp,
    derivationPathSchemes,
    derivationPathLimit: DERIVATION_PATH_LIMIT,
  });
