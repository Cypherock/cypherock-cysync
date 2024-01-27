import { CreateAccountDeviceEvent } from '@cypherock/coin-support-interfaces';
import {
  GetAddressesFromDevice,
  IMakeCreateAccountsObservableParams,
  makeCreateAccountsObservable,
} from '@cypherock/coin-support-utils';
import { evmCoinList } from '@cypherock/coins';
import { AccountTypeMap } from '@cypherock/db-interfaces';
import { EvmApp, GetPublicKeysEvent } from '@cypherock/sdk-app-evm';
import { IDeviceConnection } from '@cypherock/sdk-interfaces';
import { hexToUint8Array } from '@cypherock/sdk-utils';
import { Observable } from 'rxjs';

import { derivationPathSchemes } from './schemes';
import {
  ICreateEvmAccountEvent,
  ICreateEvmAccountParams,
  ICreatedEvmAccount,
} from './types';

import * as services from '../../services';
import { formatAddress } from '../formatAddress';

const DERIVATION_PATH_LIMIT = 30;

const getAddressesFromDevice: GetAddressesFromDevice<EvmApp> = async params => {
  const { app, walletId, coinId, derivationPaths, observer } = params;

  const events: Record<CreateAccountDeviceEvent, boolean | undefined> =
    {} as any;

  const evmToDeviceEventMap: Partial<
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
    chainId: evmCoinList[coinId].chain,
    onEvent: event => {
      const deviceEvent = evmToDeviceEventMap[event];
      if (deviceEvent !== undefined) {
        events[deviceEvent] = true;
      }

      observer.next({ type: 'Device', device: { isDone: false, events } });
    },
  });

  observer.next({ type: 'Device', device: { isDone: true, events } });

  return addresses.map(a => formatAddress({ address: a, coinId }));
};

const createAccountFromAddress: IMakeCreateAccountsObservableParams<EvmApp>['createAccountFromAddress'] =
  async (addressDetails, params) => {
    const coin = evmCoinList[params.coinId];
    const name = `${coin.name} ${addressDetails.index + 1}`;

    const account: ICreatedEvmAccount = {
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

const createApp = async (connection: IDeviceConnection) =>
  EvmApp.create(connection);

const getBalanceAndTxnCount = async (
  address: string,
  params: ICreateEvmAccountParams,
) => ({
  balance: await services.getBalance(address, params.coinId),
  txnCount: (
    await services.getTransactions({
      address,
      assetId: params.coinId,
      limit: 1,
    })
  ).result.length,
});

export const createAccounts = (
  params: ICreateEvmAccountParams,
): Observable<ICreateEvmAccountEvent> =>
  makeCreateAccountsObservable<EvmApp, ICreateEvmAccountEvent>({
    ...params,
    createAccountFromAddress,
    getBalanceAndTxnCount,
    getAddressesFromDevice,
    createApp,
    derivationPathSchemes,
    derivationPathLimit: DERIVATION_PATH_LIMIT,
  });
