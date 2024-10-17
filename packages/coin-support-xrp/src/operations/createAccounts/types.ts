import {
  ICreatedAccount,
  ICreateAccountParams,
  ICreateAccountEvent,
} from '@cypherock/coin-support-interfaces';
import { IAccount } from '@cypherock/db-interfaces';

import { XrpDerivationSchemeName } from './schemes/types';

export interface IXrpAccount extends IAccount {
  derivationScheme: XrpDerivationSchemeName;
}

export interface ICreatedXrpAccount extends ICreatedAccount {
  derivationScheme: XrpDerivationSchemeName;
}

export type ICreateXrpAccountParams = ICreateAccountParams;

export interface ICreateXrpAccountEvent extends ICreateAccountEvent {
  account?: ICreatedXrpAccount;
}
