import { IDatabase } from '@cypherock/db-interfaces';

export interface IMigrationItem {
  id: string;
  name: string;
  up: (db: IDatabase) => Promise<void>;
  down: (db: IDatabase) => Promise<void>;
}
