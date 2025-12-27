import {
  ICreatedAccount,
  ICreateAccountParams,
  ICreateAccountEvent,
} from '@cypherock/coin-support-interfaces';
import { IAccount } from '@cypherock/db-interfaces';

import { CantonDerivationSchemeName } from './schemes/types';

export interface ICantonAccount extends IAccount {
  derivationScheme: CantonDerivationSchemeName;
}

export interface ICreatedCantonAccount extends ICreatedAccount {
  derivationScheme: CantonDerivationSchemeName;
}

export type ICreateCantonAccountParams = ICreateAccountParams;

export interface ICreateCantonAccountEvent extends ICreateAccountEvent {
  account?: ICreatedCantonAccount;
}
