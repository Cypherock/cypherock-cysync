import { ITableSchema } from '../repository/utils/types';

export type DefaultFields = '__id' | '__version';
export interface ITableDetails<T> {
  name: string;
  schema: ITableSchema<T>;
}
