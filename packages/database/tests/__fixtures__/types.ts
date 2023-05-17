import { IRepository, ObjectLiteral } from '@cypherock/db-interfaces';
import { Database } from '../../src/database';
import { BaseFields } from '../../src/entity/types';

export interface ITestClass<Entity extends ObjectLiteral> {
  repo: IRepository<Entity>;
  name: string;
  onlyRequired: Entity[];
  invalid: Entity[];
  partial: Partial<Entity>[];
  all: Required<Omit<Entity, BaseFields>>[];
  optionalRandomUndefined?: Partial<Entity>[];
  setRepository: (db: Database) => void;
}
