import { IGetOptions, ObjectLiteral } from '@cypherock/db-interfaces';
import { Database } from 'better-sqlite3';
import { ITableSchema, typeMap } from './types';
import { BaseSchema } from '../../entity';

function getValuesForSqlite<T>(
  obj: ObjectLiteral,
  schema: ITableSchema<T>,
  columnArray?: string[],
): any[] {
  const values: any[] = [];
  const completeSchema = { ...schema, ...BaseSchema };
  for (const key of columnArray ?? Object.keys(obj)) {
    if (Object.prototype.hasOwnProperty.call(completeSchema, key)) {
      const { type } = completeSchema[key as keyof T];
      const value = obj[key];
      const parsedValue =
        value !== undefined ? typeMap[type].sqlSerializer(value) : null;
      values.push(parsedValue);
    }
  }
  return values;
}

function getSqlTypes<T>(schema: ITableSchema<T>) {
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
}

export function getInterfaceObj<T>(objs: any[], schema: ITableSchema<T>): T[] {
  const entities: T[] = [];
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
}

export function createTable<T>(
  tableName: string,
  db: Database,
  schema: ITableSchema<T>,
) {
  const tableColumns = getSqlTypes(schema);
  const statement = `CREATE TABLE IF NOT EXISTS \`${tableName}\` ( __id TEXT PRIMARY KEY, __version NUMERIC NOT NULL, ${tableColumns.join(
    ', ',
  )})`;
  db.prepare(statement).run();
}

export function insertObjects<T>(
  tableName: string,
  db: Database,
  schema: ITableSchema<T>,
  entities: ObjectLiteral[],
) {
  const tableColumns = [...Object.keys(schema), '__version', '__id'];
  const statement = `INSERT INTO \`${tableName}\` ( ${tableColumns.join(
    ', ',
  )}) VALUES ${entities
    .map(() => `(${tableColumns.map(() => '?').join(', ')})`)
    .join(', ')}`;

  const values = entities.flatMap(entity =>
    getValuesForSqlite(entity, schema, tableColumns),
  );
  const { changes } = db.prepare(statement).run(values);
  return changes;
}

export function updateObjects<T>(
  tableName: string,
  db: Database,
  schema: ITableSchema<T>,
  ids: string[],
  entity: ObjectLiteral,
) {
  const updateStatement = (tableColumns: string[]) =>
    `UPDATE \`${tableName}\` SET ${tableColumns
      .map(key => `${key} = ?`)
      .join(', ')} WHERE __id IN (${ids.map(() => '?').join(', ')})`;

  const statement = updateStatement(Object.keys(entity));
  const { changes } = db
    .prepare(statement)
    .run(getValuesForSqlite(entity, schema), ids);
  return changes;
}

export function removeObjects(tableName: string, db: Database, ids: string[]) {
  const statement = `DELETE FROM \`${tableName}\` WHERE __id IN (${ids
    .map(() => '?')
    .join(', ')})`;
  const { changes } = db.prepare(statement).run(ids);
  return changes;
}

export function selectObjects<T>(
  tableName: string,
  db: Database,
  schema: ITableSchema<T>,
  entities: ObjectLiteral[],
  options?: IGetOptions<T>,
) {
  const columnArray = entities.map(entity => Object.keys(entity));
  const whereClause =
    entities.length > 0
      ? `WHERE ${columnArray
          .map(entity =>
            entity.map((key: string) => `${key} LIKE ?`).join(' AND '),
          )
          .join(' OR ')}`
      : '';
  const orderByClause = options?.sortBy
    ? `ORDER BY ${options.sortBy.key.toString()} ${
        options.sortBy.descending ? 'DESC' : 'ASC'
      }`
    : '';
  const limitClause = options?.limit ? `LIMIT ${options.limit}` : '';
  const statement = `SELECT * FROM \`${tableName}\` ${whereClause} ${orderByClause} ${limitClause}`;

  return db
    .prepare(statement)
    .all(entities.flatMap(entity => getValuesForSqlite(entity, schema)));
}
