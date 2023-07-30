import {
  IDatabase,
  IRepository,
  ObjectLiteral,
} from '@cypherock/db-interfaces';

import { BaseFields } from '../../src/entity/types';

export interface ITestClass<Entity extends ObjectLiteral> {
  repo: IRepository<Entity>;
  name: string;
  onlyRequired: Entity[];
  invalid: Entity[];
  partial: Partial<Entity>[];

  sortKey: string;
  isSortDescending: boolean;
  sorted: Entity[];

  all: Required<Omit<Entity, BaseFields>>[];
  optionalRandomUndefined?: Partial<Entity>[];
  setRepository: (db: IDatabase) => void;
}
