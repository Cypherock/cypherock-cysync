import {
  ICreatedAccount,
  ICreateAccountParams,
  ICreateAccountEvent,
} from '@cypherock/coin-support-interfaces';
import { IAccount } from '@cypherock/db-interfaces';

import { NearDerivationSchemeName } from './schemes/types';

export interface INearAccount extends IAccount {
  derivationScheme: NearDerivationSchemeName;
}

export interface ICreatedNearAccount extends ICreatedAccount {
  derivationScheme: NearDerivationSchemeName;
}

export type ICreateNearAccountParams = ICreateAccountParams;

export interface ICreateNearAccountEvent extends ICreateAccountEvent {
  account?: ICreatedNearAccount;
}
