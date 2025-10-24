import { CreateAccountDeviceEvent } from '@cypherock/coin-support-interfaces';
import {
  GetAddressesFromDevice,
  IMakeCreateAccountsObservableParams,
  makeCreateAccountsObservable,
} from '@cypherock/coin-support-utils';
import { siaCoinList } from '@cypherock/coins';
import { AccountTypeMap } from '@cypherock/db-interfaces';
import { GetPublicKeysEvent, SiaApp } from '@cypherock/sdk-app-sia';
import { hexToUint8Array } from '@cypherock/sdk-utils';
import { Observable } from 'rxjs';

import { derivationPathSchemes } from './schemes';
import {
  ICreateSiaAccountEvent,
  ICreateSiaAccountParams,
  ICreatedSiaAccount,
} from './types';

import * as services from '../../services';
import { createApp } from '../../utils';

const DERIVATION_PATH_LIMIT = 30;

const getAddressesFromDevice: GetAddressesFromDevice<SiaApp> = async params => {
  const { app, walletId, derivationPaths, observer } = params;

  const events: Record<CreateAccountDeviceEvent, boolean | undefined> =
    {} as any;

  const siaToDeviceEventMap: Partial<
    Record<GetPublicKeysEvent, CreateAccountDeviceEvent | undefined>
  > = {
    [GetPublicKeysEvent.INIT]: CreateAccountDeviceEvent.INIT,
    [GetPublicKeysEvent.CONFIRM]: CreateAccountDeviceEvent.CONFIRMED,
    [GetPublicKeysEvent.PASSPHRASE]:
      CreateAccountDeviceEvent.PASSPHRASE_ENTERED,
    [GetPublicKeysEvent.PIN_CARD]: CreateAccountDeviceEvent.CARD_TAPPED,
  };

  const { publicKeys, addresses } = await app.getPublicKeys({
    walletId: hexToUint8Array(walletId),
    derivationPaths: derivationPaths.map(e => ({ path: e.derivationPath })),
    onEvent: event => {
      const deviceEvent = siaToDeviceEventMap[event];
      if (deviceEvent !== undefined) {
        events[deviceEvent] = true;
      }

      observer.next({ type: 'Device', device: { isDone: false, events } });
    },
  });

  observer.next({ type: 'Device', device: { isDone: true, events } });

  const encodedAddresses = addresses.map(
    (address, index) => `${address}|${publicKeys[index]}`,
  );

  return encodedAddresses;
};

const createAccountFromAddress: IMakeCreateAccountsObservableParams<SiaApp>['createAccountFromAddress'] =
  async (addressDetails, params) => {
    const [address, publicKey] = addressDetails.address.split('|');
    const { index, balance, txnCount, derivationPath, schemeName } =
      addressDetails;
    const { coinId, walletId } = params;

    const coin = siaCoinList[coinId];
    const name = `${coin.name} ${index + 1}`;

    const account: ICreatedSiaAccount = {
      name,
      xpubOrAddress: address,
      balance,
      spendableBalance: balance,
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

const getBalanceAndTxnCount = async (encodedAddress: string) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [address, _publicKey] = encodedAddress.split('|');
  console.log('Returned Balance from createAccount ');

  return {
    balance: await services.getBalance(address),
    txnCount: (await services.getTransactions(address)).count,
  };
};

export const createAccounts = (
  params: ICreateSiaAccountParams,
): Observable<ICreateSiaAccountEvent> =>
  makeCreateAccountsObservable<SiaApp, ICreateSiaAccountEvent>({
    ...params,
    createAccountFromAddress,
    getBalanceAndTxnCount,
    getAddressesFromDevice,
    createApp,
    derivationPathSchemes,
    derivationPathLimit: DERIVATION_PATH_LIMIT,
  });
