import { ITableSchema } from '../repository/Repository';

export interface ITableDetails {
  name: string;
  schema: ITableSchema;
}
