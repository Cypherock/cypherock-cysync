import { IGetOptions, ObjectLiteral } from '@cypherock/db-interfaces';
import { Database } from 'better-sqlite3';
import { ITableSchema, typeMap } from './types';

export const sqlParser = {
  createTable<T>(tableName: string, db: Database, schema: ITableSchema<T>) {
    const tableColumns = this.getSqlTypes(schema);
    const statement = `CREATE TABLE IF NOT EXISTS \`${tableName}\` ( __id TEXT PRIMARY KEY, __version NUMERIC NOT NULL, ${tableColumns.join(
      ', ',
    )})`;
    db.prepare(statement).run();
  },

  insertObjects<T>(
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
      this.getValuesForSqliteByColumns(entity, tableColumns),
    );
    const { changes } = db.prepare(statement).run(values);
    return changes;
  },

  updateObjects(
    tableName: string,
    db: Database,
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
      .run(this.getValuesForSqlite(entity), ids);
    return changes;
  },

  removeObjects(tableName: string, db: Database, ids: string[]) {
    const statement = `DELETE FROM \`${tableName}\` WHERE __id IN (${ids
      .map(() => '?')
      .join(', ')})`;
    const { changes } = db.prepare(statement).run(ids);
    return changes;
  },

  selectObjects<T>(
    tableName: string,
    db: Database,
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

    const result = db
      .prepare(statement)
      .all(entities.flatMap(entity => this.getValuesForSqlite(entity)));

    return result;
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

  getValuesForSqliteByColumns(
    obj: ObjectLiteral,
    columnArray: string[],
  ): any[] {
    const values: any[] = [];

    for (const key of columnArray) {
      const value = obj[key];
      values.push(typeMap[typeof value].sqlSerializer(value));
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
