import { IAccount, IKeyValueStore } from '@cypherock/db-interfaces';

export interface IPrepareCantonExternalPartyTransactionParams {
  account: IAccount;
  keyDB: IKeyValueStore;
}
