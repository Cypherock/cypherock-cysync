import { IAccount } from '@cypherock/db-interfaces';

export interface IAccountState {
  isLoaded: boolean;
  accounts: IAccount[];
}
