import {
  ICreatedAccount,
  ICreateAccountParams,
  ICreateAccountEvent,
} from '@cypherock/coin-support-interfaces';
import { IAccount } from '@cypherock/db-interfaces';

import { EvmDerivationSchemeName } from './schemes/types';

export interface IEvmAccount extends IAccount {
  derivationScheme: EvmDerivationSchemeName;
  extraData: {
    lastInternalTransactionBlockHeight?: number;
    lastContractTransactionBlockHeight?: number;
  };
}

export interface ICreatedEvmAccount extends ICreatedAccount {
  derivationScheme: EvmDerivationSchemeName;
  extraData: {
    lastInternalTransactionBlockHeight?: number;
    lastContractTransactionBlockHeight?: number;
  };
}

export type ICreateEvmAccountParams = ICreateAccountParams;

export interface ICreateEvmAccountEvent extends ICreateAccountEvent {
  account?: ICreatedEvmAccount;
}
