import { IDatabase, IAccount, IKeyValueStore } from '@cypherock/db-interfaces';
import { IDeviceConnection } from '@cypherock/sdk-interfaces';

import { IX0Session } from './x0';

export enum CreateAccountDeviceEvent {
  INIT = 0,
  CONFIRMED = 1,
  PASSPHRASE_ENTERED = 2,
  CARD_TAPPED = 3,
}

export interface ICreateAccountParams {
  db: IDatabase;
  /** X1 device connection. Provide either this or `x0`, not both. */
  connection?: IDeviceConnection;
  /** X0 card session. Provide either this or `connection`, not both. */
  x0?: IX0Session;
  walletId: string;
  coinId: string;
  waitInMSBetweenEachAccountAPI?: number;
  keyDB?: IKeyValueStore;
}

export type ICreateAccountEventType = 'Account' | 'Device';

export interface ICreatedAccount extends IAccount {
  isNew: boolean;
}

export interface ICreateAccountEvent {
  type: ICreateAccountEventType;
  account?: ICreatedAccount;
  device?: {
    isDone: boolean;
    events: Record<CreateAccountDeviceEvent, boolean | undefined>;
  };
}
