import {
  ICreateAccountParams,
  ICreateAccountEvent,
  ICreatedAccount,
  CreateAccountDeviceEvent,
} from '@cypherock/coin-support-interfaces';
import { IAccount } from '@cypherock/db-interfaces';
import { GetXpubsEvent } from '@cypherock/sdk-app-btc';

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
  Record<GetXpubsEvent, CreateAccountDeviceEvent | undefined>
> = {
  [GetXpubsEvent.INIT]: CreateAccountDeviceEvent.INIT,
  [GetXpubsEvent.CONFIRM]: CreateAccountDeviceEvent.CONFIRMED,
  [GetXpubsEvent.PASSPHRASE]: CreateAccountDeviceEvent.PASSPHRASE_ENTERED,
  [GetXpubsEvent.PIN_CARD]: CreateAccountDeviceEvent.CARD_TAPPED,
};
