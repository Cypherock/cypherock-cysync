import {
  ICreatedAccount,
  ICreateAccountParams,
  ICreateAccountEvent,
} from '@cypherock/coin-support-interfaces';
import { IAccount } from '@cypherock/db-interfaces';

import { SolanaDerivationSchemeName } from './schemes/types';

export interface ISolanaAccount extends IAccount {
  derivationScheme: SolanaDerivationSchemeName;
}

export interface ICreatedSolanaAccount extends ICreatedAccount {
  derivationScheme: SolanaDerivationSchemeName;
}

export type ICreateSolanaAccountParams = ICreateAccountParams;

export interface ICreateSolanaAccountEvent extends ICreateAccountEvent {
  account?: ICreatedSolanaAccount;
}
