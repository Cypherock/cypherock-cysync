import { IDatabase, IAccount } from '@cypherock/db-interfaces';
import { GetPublicKeysStatus } from '@cypherock/sdk-app-evm';
import { IDeviceConnection } from '@cypherock/sdk-interfaces';

import { DerivationSchemeName } from './schemes/types';

export interface IEvmAccount extends IAccount {
  extraData: {
    derivationScheme: DerivationSchemeName;
  };
}

export interface ICreateAccountParams {
  db: IDatabase;
  connection: IDeviceConnection;
  walletId: string;
  coinId: string;
  waitInMSBetweenEachAccountAPI?: number;
}

export type ICreateAccountEventType = 'Account' | 'Device';

export interface ICreateAccountEvent {
  type: ICreateAccountEventType;
  account?: IEvmAccount;
  device?: {
    isDone: boolean;
    events: Record<GetPublicKeysStatus, boolean | undefined>;
  };
}
