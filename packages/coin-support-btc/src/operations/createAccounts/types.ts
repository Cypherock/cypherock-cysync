import {
  ICreateAccountParams,
  ICreateAccountEvent,
  ICreatedAccount,
  CreateAccountDeviceEvent,
} from '@cypherock/coin-support-interfaces';
import { IAccount } from '@cypherock/db-interfaces';
import { GetXpubsStatus } from '@cypherock/sdk-app-btc';

import { BTCDerivationSchemeName } from './schemes/types';

export interface IBtcAccount extends IAccount {
  derivationScheme: BTCDerivationSchemeName;
  extraData?: {
    unconfirmedBalance?: string;
  };
}

export interface ICreatedBtcAccount extends ICreatedAccount {
  derivationScheme: BTCDerivationSchemeName;
}

export type ICreateBtcAccountParams = ICreateAccountParams;

export interface ICreateBtcAccountEvent extends ICreateAccountEvent {
  account?: ICreatedBtcAccount;
}

export const btcToDeviceEventMap: Partial<
  Record<GetXpubsStatus, CreateAccountDeviceEvent | undefined>
> = {
  [GetXpubsStatus.GET_XPUBS_STATUS_INIT]: CreateAccountDeviceEvent.INIT,
  [GetXpubsStatus.GET_XPUBS_STATUS_CONFIRM]: CreateAccountDeviceEvent.CONFIRMED,
  [GetXpubsStatus.GET_XPUBS_STATUS_PASSPHRASE]:
    CreateAccountDeviceEvent.PASSPHRASE_ENTERED,
  [GetXpubsStatus.GET_XPUBS_STATUS_CARD]: CreateAccountDeviceEvent.CARD_TAPPED,
};
