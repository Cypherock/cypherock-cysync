import {
  ICreatedAccount,
  ICreateAccountParams,
  ICreateAccountEvent,
} from '@cypherock/coin-support-interfaces';
import { IAccount } from '@cypherock/db-interfaces';

import { StellarDerivationSchemeName } from './schemes/types';

export interface IStellarAccount extends IAccount {
  derivationScheme: StellarDerivationSchemeName;
}

export interface ICreatedStellarAccount extends ICreatedAccount {
  derivationScheme: StellarDerivationSchemeName;
}

export type ICreateStellarAccountParams = ICreateAccountParams;

export interface ICreateStellarAccountEvent extends ICreateAccountEvent {
  account?: ICreatedStellarAccount;
}
