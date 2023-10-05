import { IEntity } from '@cypherock/db-interfaces';

import { ITableSchema } from '../repository/utils/types';

export interface ITableDetails<T> {
  name: string;
  schema: ITableSchema<T>;
}
export const BaseSchema: ITableSchema<IEntity> = {
  __id: { type: 'string' },
  __version: { type: 'number' },
  meta: { type: 'object' },
};

export type BaseFields = keyof IEntity;
