import {
  ICreateAccountParams,
  ICreateAccountEvent,
} from '@cypherock/coin-support-interfaces';
import { IAccount } from '@cypherock/db-interfaces';
import { GetPublicKeysStatus } from '@cypherock/sdk-app-evm';

import { EvmDerivationSchemeName } from './schemes/types';

export interface IEvmAccount extends IAccount {
  extraData: {
    derivationScheme: EvmDerivationSchemeName;
  };
}

export type ICreateEvmAccountParams = ICreateAccountParams;

export interface ICreateEvmAccountEvent extends ICreateAccountEvent {
  account?: IEvmAccount;
  device?: {
    isDone: boolean;
    events: Record<GetPublicKeysStatus, boolean | undefined>;
  };
}
