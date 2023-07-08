import { IDatabase } from '@cypherock/db-interfaces';
import { IDeviceConnection } from '@cypherock/sdk-interfaces';

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
  account?: any;
  device?: {
    isDone: boolean;
    events: Record<number, boolean | undefined>;
  };
}
