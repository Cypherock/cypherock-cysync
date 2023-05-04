import { IDeviceConnection } from '@cypherock/sdk-interfaces';
import { IDatabase } from '@cypherock/db-interfaces';
import { IAccount } from '@cypherock/db-interfaces/dist/entities/account';
import { DerivationSchemeName } from './schemes/types';

export interface ICreateAccountParams {
  db: IDatabase;
  connection: IDeviceConnection;
  walletId: string;
  coinId: string;
  waitInMSBetweenEachAccountAPI?: number;
}

export interface IEvmAccount extends IAccount {
  extraData: {
    derivationScheme: DerivationSchemeName;
  };
}
