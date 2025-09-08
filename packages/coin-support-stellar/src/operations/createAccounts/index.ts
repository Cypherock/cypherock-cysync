import { CreateAccountDeviceEvent } from '@cypherock/coin-support-interfaces';
import {
  GetAddressesFromDevice,
  IMakeCreateAccountsObservableParams,
  makeCreateAccountsObservable,
} from '@cypherock/coin-support-utils';
import { stellarCoinList } from '@cypherock/coins';
import { BigNumber } from '@cypherock/cysync-utils';
import { AccountTypeMap } from '@cypherock/db-interfaces';
import { GetPublicKeysEvent, StellarApp } from '@cypherock/sdk-app-stellar';
import { hexToUint8Array } from '@cypherock/sdk-utils';
import { Observable } from 'rxjs';

import { derivationPathSchemes } from './schemes';
import {
  ICreateStellarAccountEvent,
  ICreateStellarAccountParams,
  ICreatedStellarAccount,
} from './types';

import * as services from '../../services';
import { createApp } from '../../utils';

const DERIVATION_PATH_LIMIT = 30;

const getAddressesFromDevice: GetAddressesFromDevice<
  StellarApp
> = async params => {
  const { app, walletId, derivationPaths, observer } = params;

  const events: Record<CreateAccountDeviceEvent, boolean | undefined> =
    {} as any;

  const stellarToDeviceEventMap: Partial<
    Record<GetPublicKeysEvent, CreateAccountDeviceEvent | undefined>
  > = {
    [GetPublicKeysEvent.INIT]: CreateAccountDeviceEvent.INIT,
    [GetPublicKeysEvent.CONFIRM]: CreateAccountDeviceEvent.CONFIRMED,
    [GetPublicKeysEvent.PASSPHRASE]:
      CreateAccountDeviceEvent.PASSPHRASE_ENTERED,
    [GetPublicKeysEvent.PIN_CARD]: CreateAccountDeviceEvent.CARD_TAPPED,
  };

  const { addresses } = await app.getPublicKeys({
    walletId: hexToUint8Array(walletId),
    derivationPaths: derivationPaths.map(e => ({ path: e.derivationPath })),
    onEvent: event => {
      const deviceEvent = stellarToDeviceEventMap[event];
      if (deviceEvent !== undefined) {
        events[deviceEvent] = true;
      }

      observer.next({ type: 'Device', device: { isDone: false, events } });
    },
  });

  observer.next({ type: 'Device', device: { isDone: true, events } });

  return addresses;
};

const createAccountFromAddress: IMakeCreateAccountsObservableParams<StellarApp>['createAccountFromAddress'] =
  async (addressDetails, params) => {
    const { address, index, balance, txnCount, derivationPath, schemeName } =
      addressDetails;
    const { coinId, walletId } = params;

    const coin = stellarCoinList[coinId];
    const name = `${coin.name} ${index + 1}`;

    const spendableBalance = BigNumber.max(
      0,
      new BigNumber(balance).minus(
        await services.getAccountReserveBalance(address, coinId),
      ),
    ).toString();

    const account: ICreatedStellarAccount = {
      name,
      xpubOrAddress: address,
      balance,
      spendableBalance,
      unit: coin.units[0].abbr,
      derivationPath,
      type: AccountTypeMap.account,
      familyId: coin.family,
      assetId: coinId,
      parentAssetId: coinId,
      walletId,
      derivationScheme: schemeName as any,
      isNew: txnCount <= 0,
      extraData: {},
      isHidden: false,
    };

    return account;
  };

const getBalanceAndTxnCount = async (
  address: string,
  params: ICreateStellarAccountParams,
) => ({
  balance: await services.getBalance(address, params.coinId),
  txnCount: (
    await services.getTransactions({
      address,
      assetId: params.coinId,
      limit: 1,
    })
  ).transactions.length,
});

export const createAccounts = (
  params: ICreateStellarAccountParams,
): Observable<ICreateStellarAccountEvent> =>
  makeCreateAccountsObservable<StellarApp, ICreateStellarAccountEvent>({
    ...params,
    createAccountFromAddress,
    getBalanceAndTxnCount,
    getAddressesFromDevice,
    createApp,
    derivationPathSchemes,
    derivationPathLimit: DERIVATION_PATH_LIMIT,
  });
