import {
  ICreateAccountParams,
  ICreateAccountEvent,
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

export type ICreateBtcAccountParams = ICreateAccountParams;

export interface ICreateBtcAccountEvent extends ICreateAccountEvent {
  account?: IBtcAccount;
  device?: {
    isDone: boolean;
    events: Record<GetXpubsStatus, boolean | undefined>;
  };
}
