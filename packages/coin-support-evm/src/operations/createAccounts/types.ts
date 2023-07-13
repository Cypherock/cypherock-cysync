import {
  ICreateAccountParams,
  ICreateAccountEvent,
} from '@cypherock/coin-support-interfaces';
import { IAccount } from '@cypherock/db-interfaces';
import { GetPublicKeysStatus } from '@cypherock/sdk-app-evm';

import { EVMDerivationSchemeName } from './schemes/types';

export interface IEvmAccount extends IAccount {
  extraData: {
    derivationScheme: EVMDerivationSchemeName;
  };
}

export type ICreateEVMAccountParams = ICreateAccountParams;

export interface ICreateEVMAccountEvent extends ICreateAccountEvent {
  account?: IEvmAccount;
  device?: {
    isDone: boolean;
    events: Record<GetPublicKeysStatus, boolean | undefined>;
  };
}
