import {
  ICreateAccountParams,
  ICreateAccountEvent,
  ICreatedAccount,
} from '@cypherock/coin-support-interfaces';
import { IAccount } from '@cypherock/db-interfaces';

import { BTCDerivationSchemeName } from './schemes/types';

export interface IBtcAccount extends IAccount {
  derivationScheme: BTCDerivationSchemeName;
}

export interface ICreatedBtcAccount extends ICreatedAccount {
  derivationScheme: BTCDerivationSchemeName;
}

export type ICreateBtcAccountParams = ICreateAccountParams;

export interface ICreateBtcAccountEvent extends ICreateAccountEvent {
  account?: ICreatedBtcAccount;
}
