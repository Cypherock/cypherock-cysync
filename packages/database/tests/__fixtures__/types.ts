import { IRepository, ObjectLiteral } from '@cypherock/db-interfaces';
import { Database } from '../../src/database';

export interface ITestClass<Entity extends ObjectLiteral> {
  repo: IRepository<Entity>;
  name: string;
  onlyRequired: Entity[];
  invalid: Entity[];
  partial: Partial<Entity>[];
  all: Entity[];
  setRepository: (db: Database) => void;
}
