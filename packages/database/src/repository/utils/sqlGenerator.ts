import { ObjectLiteral } from '@cypherock/db-interfaces';
import { ITableSchema } from './schemaValidator';

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

  getUpdateStatement(tableName: string, tableColumns: string[]) {
    return `UPDATE \`${tableName}\` SET ${tableColumns
      .map(key => `${key} = ?`)
      .join(', ')} WHERE __id= ?`;
  },

  getDeleteStatement(tableName: string, ids: string[]) {
    return `DELETE FROM \`${tableName}\` WHERE __id IN (${ids
      .map(() => '?')
      .join(', ')})`;
  },

  getValuesForSqlite(obj?: ObjectLiteral): any[] {
    const values: any[] = [];

    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        const value = obj[key];

        switch (typeof value) {
          case 'string':
          case 'number':
          case 'bigint':
            values.push(value.toString());
            break;
          case 'boolean':
            values.push(value ? '1' : '0');
            break;
          case 'object':
            values.push(JSON.stringify(value));
            break;
          default:
            values.push(undefined);
            break;
        }
      }
    }

    return values;
  },

  getSqlTypes<T>(schema: ITableSchema<T>) {
    const values: string[] = [];
    for (const key in schema) {
      if (Object.prototype.hasOwnProperty.call(schema, key)) {
        const value = schema[key];
        let attribute = '';
        switch (value.type) {
          case 'bigint':
          case 'number':
          case 'boolean':
            attribute = 'NUMERIC';
            break;
          default:
            attribute = 'TEXT';
            break;
        }
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
          switch (value.type) {
            case 'boolean':
              entity[key] = !!obj[key];
              break;
            case 'array':
            case 'object':
              entity[key] = JSON.parse(obj[key]);
              break;
            default:
              entity[key] = obj[key];
              break;
          }
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
