import {
  ICreatedAccount,
  ICreateAccountParams,
  ICreateAccountEvent,
} from '@cypherock/coin-support-interfaces';
import { IAccount } from '@cypherock/db-interfaces';

import { TronDerivationSchemeName } from './schemes/types';

export interface ITronAccount extends IAccount {
  derivationScheme: TronDerivationSchemeName;
  extraData: {
    lastInternalTransactionBlockHeight?: number;
    lastContractTransactionBlockHeight?: number;
  };
}

export interface ICreatedTronAccount extends ICreatedAccount {
  derivationScheme: TronDerivationSchemeName;
  extraData: {
    lastInternalTransactionBlockHeight?: number;
    lastContractTransactionBlockHeight?: number;
  };
}

export type ICreateTronAccountParams = ICreateAccountParams;

export interface ICreateTronAccountEvent extends ICreateAccountEvent {
  account?: ICreatedTronAccount;
}
