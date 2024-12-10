import { CreateAccountDeviceEvent } from '@cypherock/coin-support-interfaces';
import {
  GetAddressesFromDevice,
  IMakeCreateAccountsObservableParams,
  makeCreateAccountsObservable,
} from '@cypherock/coin-support-utils';
import { starknetCoinList } from '@cypherock/coins';
import { AccountTypeMap } from '@cypherock/db-interfaces';
import { GetPublicKeysEvent, StarknetApp } from '@cypherock/sdk-app-starknet';
import { hexToUint8Array } from '@cypherock/sdk-utils';
import { Observable } from 'rxjs';

import { derivationPathSchemes } from './schemes';
import {
  ICreateStarknetAccountEvent,
  ICreateStarknetAccountParams,
  ICreatedStarknetAccount,
} from './types';

import * as services from '../../services';
import { createApp, deriveAddress } from '../../utils';

const DERIVATION_PATH_LIMIT = 15;
const STRK_TOKEN_CONTRACT =
  '0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d';

const getAddressesFromDevice: GetAddressesFromDevice<
  StarknetApp
> = async params => {
  const { app, walletId, derivationPaths, observer } = params;

  const events: Record<CreateAccountDeviceEvent, boolean | undefined> =
    {} as any;

  const starknetToDeviceEventMap: Partial<
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
      const deviceEvent = starknetToDeviceEventMap[event];
      if (deviceEvent !== undefined) {
        events[deviceEvent] = true;
      }

      observer.next({ type: 'Device', device: { isDone: false, events } });
    },
  });

  observer.next({ type: 'Device', device: { isDone: true, events } });

  return publicKeys; // .map(publicKey => `0x${publicKey.replace(/^0x/i, "")}`);   // prepend 0x if it's not there
};

const createAccountFromAddress: IMakeCreateAccountsObservableParams<StarknetApp>['createAccountFromAddress'] =
  async (addressDetails, params) => {
    const coin = starknetCoinList[params.coinId];
    const name = `${coin.name} ${addressDetails.index + 1}`;

    const account: ICreatedStarknetAccount = {
      name,
      xpubOrAddress: deriveAddress(addressDetails.address, params.coinId),
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
      extraData: {
        salt: addressDetails.address,
      },
      isHidden: false,
    };

    return account;
  };

const getBalanceAndTxnCount = async (
  publicKey: string,
  params: ICreateStarknetAccountParams,
) => {
  const address = deriveAddress(publicKey, params.coinId);
  return {
    balance: await services.getBalance(
      address,
      STRK_TOKEN_CONTRACT,
      params.coinId,
    ),
    txnCount: (
      await services.getTransactions({
        address,
        assetId: params.coinId,
      })
    ).tokenTransfers.length,
  };
};

export const createAccounts = (
  params: ICreateStarknetAccountParams,
): Observable<ICreateStarknetAccountEvent> =>
  makeCreateAccountsObservable<StarknetApp, ICreateStarknetAccountEvent>({
    ...params,
    createAccountFromAddress,
    getBalanceAndTxnCount,
    getAddressesFromDevice,
    createApp,
    derivationPathSchemes,
    derivationPathLimit: DERIVATION_PATH_LIMIT,
  });
