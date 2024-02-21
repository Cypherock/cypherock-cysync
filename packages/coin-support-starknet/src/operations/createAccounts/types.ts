import {
  ICreatedAccount,
  ICreateAccountParams,
  ICreateAccountEvent,
} from '@cypherock/coin-support-interfaces';
import { IAccount } from '@cypherock/db-interfaces';

import { StarknetDerivationSchemeName } from './schemes/types';

export interface IStarknetAccount extends IAccount {
  derivationScheme: StarknetDerivationSchemeName;
  extraData: {
    salt?: string;
  };
}

export interface ICreatedStarknetAccount extends ICreatedAccount {
  derivationScheme: StarknetDerivationSchemeName;
  extraData: {
    salt: string;
  };
}

export type ICreateStarknetAccountParams = ICreateAccountParams;

export interface ICreateStarknetAccountEvent extends ICreateAccountEvent {
  account?: ICreatedStarknetAccount;
}
