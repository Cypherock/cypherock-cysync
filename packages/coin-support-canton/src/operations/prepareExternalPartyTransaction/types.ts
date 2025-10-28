import { IDatabase } from '@cypherock/db-interfaces';

export interface IPrepareCantonExternalPartyTransactionParams {
  accountId: string;
  db: IDatabase;
}
