import { IGetOptions, ObjectLiteral } from '@cypherock/db-interfaces';
import { ITableSchema, typeMap } from './types';

export const sqlParser = {
  getCreateStatement(tableName: string, tableColumns: string[]) {
    return `CREATE TABLE IF NOT EXISTS \`${tableName}\` ( __id TEXT PRIMARY KEY, __version NUMERIC NOT NULL, ${tableColumns.join(
      ', ',
    )})`;
  },

  getInsertStatement(tableName: string, tableColumns: string[]) {
    return `INSERT INTO \`${tableName}\` ( __id, ${tableColumns.join(
      ', ',
    )}) VALUES (?, ${tableColumns.map(() => '?').join(', ')})`;
  },

  getUpdateStatement(tableName: string, tableColumns: string[], ids: string[]) {
    return `UPDATE \`${tableName}\` SET ${tableColumns
      .map(key => `${key} = ?`)
      .join(', ')} WHERE __id IN (${ids.map(() => '?').join(', ')})`;
  },

  getDeleteStatement(tableName: string, ids: string[]) {
    return `DELETE FROM \`${tableName}\` WHERE __id IN (${ids
      .map(() => '?')
      .join(', ')})`;
  },

  getSelectStatement<T>(
    tableName: string,
    tableColumns: string[][],
    options?: IGetOptions<T>,
  ) {
    const whereClause =
      tableColumns.length > 0
        ? `WHERE ${tableColumns
            .map(entity => entity.map(key => `${key} LIKE ?`).join(' AND '))
            .join(' OR ')}`
        : '';
    const orderByClause = options?.sortBy
      ? `ORDER BY ${options.sortBy.key.toString()} ${
          options.sortBy.descending ? 'DESC' : 'ASC'
        }`
      : '';
    const limitClause = options?.limit ? `LIMIT ${options.limit}` : '';
    return `SELECT * FROM \`${tableName}\` ${whereClause} ${orderByClause} ${limitClause}`;
  },

  getValuesForSqlite(obj?: ObjectLiteral): any[] {
    const values: any[] = [];
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        const value = obj[key];
        values.push(typeMap[typeof value].sqlSerializer(value));
      }
    }
    return values;
  },

  getSqlTypes<T>(schema: ITableSchema<T>) {
    const values: string[] = [];
    for (const key in schema) {
      if (Object.prototype.hasOwnProperty.call(schema, key)) {
        const value = schema[key];
        let attribute = typeMap[value.type].sqlColumnType;
        if (!value.isOptional) attribute += ' NOT NULL';
        values.push(`${key} ${attribute}`);
      }
    }
    return values;
  },

  getInterfaceObj<Entity>(objs: any[], schema: ITableSchema<Entity>): Entity[] {
    const entities: Entity[] = [];
    for (const obj of objs) {
      const entity: any = {};
      for (const key in schema) {
        if (Object.prototype.hasOwnProperty.call(schema, key)) {
          const value = schema[key];
          entity[key] = typeMap[value.type].sqlDeserializer(obj[key]);
          if (value.isOptional && obj[key] === null) {
            delete obj[key];
            delete entity[key];
          }
        }
      }
      entities.push({ ...obj, ...entity });
    }
    return entities;
  },
};
