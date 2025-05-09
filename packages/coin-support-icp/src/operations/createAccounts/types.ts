import {
  ICreatedAccount,
  ICreateAccountParams,
  ICreateAccountEvent,
} from '@cypherock/coin-support-interfaces';
import { IAccount } from '@cypherock/db-interfaces';

import { IcpDerivationSchemeName } from './schemes/types';

export interface IIcpAccount extends IAccount {
  derivationScheme: IcpDerivationSchemeName;
  extraData: {
    publicKey: string;
  };
}

export interface ICreatedIcpAccount extends ICreatedAccount {
  derivationScheme: IcpDerivationSchemeName;
  extraData: {
    publicKey: string;
  };
}

export type ICreateIcpAccountParams = ICreateAccountParams;

export interface ICreateIcpAccountEvent extends ICreateAccountEvent {
  account?: ICreatedIcpAccount;
}
