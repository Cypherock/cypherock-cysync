import {
  ICreatedAccount,
  ICreateAccountParams,
  ICreateAccountEvent,
} from '@cypherock/coin-support-interfaces';
import { IAccount } from '@cypherock/db-interfaces';

import { SiaDerivationSchemeName } from './schemes/types';

export interface ISiaAccount extends IAccount {
  derivationScheme: SiaDerivationSchemeName;
  extraData?: {
    publicKey?: string;
    lastConfirmedHash?: string;
  };
}

export interface ICreatedSiaAccount extends ICreatedAccount {
  derivationScheme: SiaDerivationSchemeName;
}

export type ICreateSiaAccountParams = ICreateAccountParams;

export interface ICreateSiaAccountEvent extends ICreateAccountEvent {
  account?: ICreatedSiaAccount;
}
