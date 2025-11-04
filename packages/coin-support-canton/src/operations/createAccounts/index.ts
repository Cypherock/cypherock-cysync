import { CreateAccountDeviceEvent } from '@cypherock/coin-support-interfaces';
import {
  GetAddressesFromDevice,
  IMakeCreateAccountsObservableParams,
  makeCreateAccountsObservable,
} from '@cypherock/coin-support-utils';
import { cantonCoinList } from '@cypherock/coins';
import { AccountTypeMap } from '@cypherock/db-interfaces';
import {
  GetPublicKeysEvent,
  CantonApp,
  derivePartyId,
} from '@cypherock/sdk-app-canton';
import { hexToUint8Array } from '@cypherock/sdk-utils';
import { Observable } from 'rxjs';

import { derivationPathSchemes } from './schemes';
import {
  ICreateCantonAccountEvent,
  ICreateCantonAccountParams,
  ICreatedCantonAccount,
} from './types';

import * as services from '../../services';
import { createApp } from '../../utils';

const DERIVATION_PATH_LIMIT = 1;

const getAddressesFromDevice: GetAddressesFromDevice<
  CantonApp
> = async params => {
  const { app, walletId, derivationPaths, observer } = params;

  const events: Record<CreateAccountDeviceEvent, boolean | undefined> =
    {} as any;

  const cantonToDeviceEventMap: Partial<
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
      const deviceEvent = cantonToDeviceEventMap[event];
      if (deviceEvent !== undefined) {
        events[deviceEvent] = true;
      }

      observer.next({ type: 'Device', device: { isDone: false, events } });
    },
  });

  observer.next({ type: 'Device', device: { isDone: true, events } });

  return publicKeys;
};

const createAccountFromAddress: IMakeCreateAccountsObservableParams<CantonApp>['createAccountFromAddress'] =
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

    const coin = cantonCoinList[coinId];
    const name = `${coin.name} ${index + 1}`;

    const account: ICreatedCantonAccount = {
      name,
      xpubOrAddress: await derivePartyId(hexToUint8Array(publicKey)),
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
      extraData: {
        publicKey,
        // Maybe update this with api in case external party is already created.
        // Still gets updated immediately after creation in syncAccount.
        isTransferPreApprovalEnabled: false,
      },
      isHidden: false,
    };

    return account;
  };

const getBalanceAndTxnCount = async (
  publicKey: string,
  params: ICreateCantonAccountParams,
) => {
  const partyId = await derivePartyId(hexToUint8Array(publicKey));
  const isAccountCreated = await services.getIsAccountCreated(
    partyId,
    params.coinId,
    params.accessToken ?? '',
  );

  if (isAccountCreated) {
    return {
      balance: await services.getBalance(
        partyId,
        params.coinId,
        params.accessToken ?? '',
      ),
      txnCount: 1,
    };
  }

  return {
    balance: '0',
    txnCount: 0,
  };
};

export const createAccounts = (
  params: ICreateCantonAccountParams,
): Observable<ICreateCantonAccountEvent> =>
  makeCreateAccountsObservable<CantonApp, ICreateCantonAccountEvent>({
    ...params,
    createAccountFromAddress,
    getBalanceAndTxnCount,
    getAddressesFromDevice,
    createApp,
    derivationPathSchemes,
    derivationPathLimit: DERIVATION_PATH_LIMIT,
  });
