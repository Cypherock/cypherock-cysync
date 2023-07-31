import { IDatabase, IAccount } from '@cypherock/db-interfaces';
import { IDeviceConnection } from '@cypherock/sdk-interfaces';

export enum CreateAccountDeviceEvent {
  INIT = 0,
  CONFIRMED = 1,
  PASSPHRASE_ENTERED = 2,
  CARD_TAPPED = 3,
}

export interface ICreateAccountParams {
  db: IDatabase;
  connection: IDeviceConnection;
  walletId: string;
  coinId: string;
  waitInMSBetweenEachAccountAPI?: number;
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
