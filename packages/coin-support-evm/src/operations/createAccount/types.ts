import { IDeviceConnection } from '@cypherock/sdk-interfaces';
import { IDatabase } from '@cypherock/db-interfaces';

export interface ICreateAccountParams {
  db: IDatabase;
  connection: IDeviceConnection;
  walletId: string;
  coinId: string;
}
