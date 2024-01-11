import { IDatabase } from '@cypherock/db-interfaces';

export interface IMigration {
  name: string;
  up: (db: IDatabase) => Promise<void>;
  down: (db: IDatabase) => Promise<void>;
}
