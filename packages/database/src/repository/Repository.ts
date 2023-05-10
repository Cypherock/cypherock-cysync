import {
  IEntity,
  IGetOptions,
  IRepository,
  ObjectLiteral,
} from '@cypherock/db-interfaces';
import { Database } from 'better-sqlite3';
import EventEmitter from 'events';
import { v4 as uuidv4 } from 'uuid';
import { ZodObject, z } from 'zod';

type datatype =
  | 'number'
  | 'string'
  | 'boolean'
  | 'object'
  | 'bigint'
  | 'function'
  | 'symbol'
  | 'undefined';

interface Type {
  type: datatype;
  isOptional?: boolean;
}

export type ITableSchema = Record<string, Type>;

export class Repository<Entity extends IEntity> implements IRepository<Entity> {
  private readonly db: Database;

  private readonly name: string;

  private readonly schema: ITableSchema;

  private zodSchema: ZodObject<any>;

  private version: number | undefined;

  private readonly emitter = new EventEmitter();

  constructor(db: Database, name: string, schema: ITableSchema) {
    this.db = db;
    this.name = name;
    this.schema = schema;
    this.setZodSchema(schema);
    this.createTableIfNotExists();
  }

  private setZodSchema(schema: ITableSchema) {
    const shape: any = {};

    for (const key in schema) {
      if (Object.prototype.hasOwnProperty.call(schema, key)) {
        const value = schema[key];
        let zType;
        switch (value.type) {
          case 'object':
            zType = z.any();
            break;
          case 'string':
            zType = z.string();
            break;
          case 'symbol':
            zType = z.symbol();
            break;
          case 'undefined':
            zType = z.undefined();
            break;
          case 'function':
            zType = z.function();
            break;
          case 'bigint':
            zType = z.bigint();
            break;
          case 'number':
            zType = z.number();
            break;
          case 'boolean':
            zType = z.boolean();
            break;
          default:
            throw new Error('Unexpected type in schema');
            break;
        }
        if (value.isOptional) zType = zType.optional();
        shape[key] = zType;
      }
    }
    this.zodSchema = z.object(shape);
  }

  // eslint-disable-next-line class-methods-use-this
  private getValuesForSqlite(obj?: ObjectLiteral): any[] {
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
  }

  private getSqlTypes() {
    const values: string[] = [];
    for (const key in this.schema) {
      if (Object.prototype.hasOwnProperty.call(this.schema, key)) {
        const value = this.schema[key];
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
  }

  private getInterfaceObj(objs: any[]): Entity[] {
    const entities: Entity[] = [];
    for (const obj of objs) {
      const entity: any = {};
      for (const key in this.schema) {
        if (Object.prototype.hasOwnProperty.call(this.schema, key)) {
          const value = this.schema[key];
          switch (value.type) {
            case 'boolean':
              entity[key] = !!obj[key];
              break;
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
  }

  private createTableIfNotExists(): void {
    const { name: tableName } = this;

    const values = this.getSqlTypes().join(', ');
    const statement = `CREATE TABLE IF NOT EXISTS \`${tableName}\` ( __id TEXT PRIMARY KEY, __version NUMERIC NOT NULL, ${values})`;
    this.db.prepare(statement).run();
  }

  private validateInput(entityLike: Partial<Entity>[] | Partial<Entity>): void {
    const entityArray = Array.isArray(entityLike) ? entityLike : [entityLike];
    for (const entity of entityArray) {
      const result = this.zodSchema.partial().safeParse(entity);
      if (!result.success)
        throw new Error(
          `Invalid entity provided for ${this.name}.\n${result.error}`,
        );
    }
  }

  insertOrUpdate(entities: Partial<Entity>[]): Promise<Entity[]>;

  insertOrUpdate(entities: Partial<Entity>[]): Promise<Entity[]>;

  insertOrUpdate(entity: Partial<Entity>): Promise<Entity>;

  async insertOrUpdate(
    entityLike: Partial<Entity> | Partial<Entity>[],
  ): Promise<Entity | Entity[]> {
    const entities = this.getVersionedEntities(entityLike);
    const result: Entity[] = [];

    for (const entity of entities) {
      const { __id, ...rest } = entity as Entity;

      if (__id) {
        const { changes } = this.db
          .prepare(
            `UPDATE \`${this.name}\` SET ${Object.keys(rest)
              .map(key => `${key} = ?`)
              .join(', ')} WHERE __id= ?`,
          )
          .run(this.getValuesForSqlite(rest), __id);

        if (changes === 0) {
          throw new Error(`Entity with id ${__id} not found`);
        } else {
          this.emitChange();
        }
        const updated = await this.fetchOne({ ...rest, __id } as any);
        if (updated) result.push(updated);
      } else {
        const id = uuidv4();
        const statement = `INSERT INTO \`${this.name}\` ( __id, ${Object.keys(
          rest,
        ).join(', ')}) VALUES (?, ${Object.keys(rest)
          .map(() => '?')
          .join(', ')})`;
        const { changes } = this.db
          .prepare(statement)
          .run(id, this.getValuesForSqlite(rest));
        if (changes === 0) {
          throw new Error(`Entity could not be inserted`);
        } else {
          this.emitChange();
        }

        const inserted = await this.fetchOne({
          ...rest,
          __id: id,
        } as any);
        if (inserted) result.push(inserted);
      }
    }

    const parsedResult = this.getInterfaceObj(result);
    return Array.isArray(entityLike) ? parsedResult : parsedResult[0];
  }

  remove(entityLikes: Partial<Entity>[]): Promise<Entity[]>;

  remove(entityLike: Partial<Entity>): Promise<Entity | undefined>;

  async remove(
    entityLike?: Partial<Entity>[] | Partial<Entity>,
    options?: IGetOptions<Entity>,
  ): Promise<Entity[] | Entity | undefined> {
    const rows = await this.fetchAll(entityLike, options);
    const ids = rows.map(row => row.__id);
    const deleteStatement = this.db.prepare(
      `DELETE FROM \`${this.name}\` WHERE __id IN (${ids
        .map(() => '?')
        .join(', ')})`,
    );
    const { changes } = deleteStatement.run(ids);
    if (changes === 0) {
      throw new Error(`Couldn't delete any rows`);
    } else {
      this.emitChange();
    }

    const parsedResult = this.getInterfaceObj(rows);
    return Array.isArray(entityLike) ? parsedResult : parsedResult[0];
  }

  private async fetchAll(
    entityLike?: Partial<Entity>[] | Partial<Entity>,
    options?: IGetOptions<Entity>,
  ): Promise<Entity[]> {
    const entities = entityLike ? this.getVersionedEntities(entityLike) : [];
    const whereClause =
      entities.length > 0
        ? `WHERE ${entities
            .map(entity =>
              Object.keys(entity as any)
                .map(key => `${key} LIKE ?`)
                .join(' AND '),
            )
            .join(' OR ')}`
        : '';
    const orderByClause = options?.sortBy
      ? `ORDER BY ${options.sortBy.key.toString()} ${
          options.sortBy.descending ? 'DESC' : 'ASC'
        }`
      : '';
    const limitClause = options?.limit ? `LIMIT ${options.limit}` : '';

    const result = this.db
      .prepare(
        `SELECT * FROM \`${this.name}\` ${whereClause} ${orderByClause} ${limitClause}`,
      )
      .all(entities.flatMap(entity => this.getValuesForSqlite(entity))) as any;
    return result;
  }

  private async fetchOne(
    entityLike: Partial<Entity>[] | Partial<Entity>,
    options?: IGetOptions<Entity>,
  ): Promise<Entity | undefined> {
    return (await this.fetchAll(entityLike, { ...options, limit: 1 }))[0];
  }

  async getAll(
    entityLike?: Partial<Entity>[] | Partial<Entity>,
    options?: IGetOptions<Entity>,
  ): Promise<Entity[]> {
    return this.getInterfaceObj(await this.fetchAll(entityLike, options));
  }

  async getOne(
    entityLike: Partial<Entity>[] | Partial<Entity>,
    options?: IGetOptions<Entity>,
  ): Promise<Entity | undefined> {
    return (await this.getAll(entityLike, { ...options, limit: 1 }))[0];
  }

  private getVersionedEntities(
    entityLike: Partial<Entity> | Partial<Entity>[],
  ): Partial<Entity>[] {
    this.validateInput(entityLike);
    const isArray = Array.isArray(entityLike);
    const entityArray = isArray ? entityLike : [entityLike];
    const versionError = (entity: Partial<Entity>) =>
      new Error(`No version specified in ${JSON.stringify(entity)}`);
    const result = [];
    for (const item of entityArray) {
      const version = item.__version ?? this.version;
      if (version === undefined) throw versionError(item);
      result.push({ ...item, __version: version });
    }
    return result;
  }

  addListener(type: string | symbol, listener: (...args: any[]) => void): void {
    this.emitter.addListener(type, listener);
  }

  removeListener(
    type: string | symbol,
    listener: (...args: any[]) => void,
  ): void {
    this.emitter.removeListener(type, listener);
  }

  removeAllListener(type?: string | symbol | undefined): void {
    this.emitter.removeAllListeners(type);
  }

  setVersion(version: number): void {
    this.version = version;
  }

  emitChange() {
    this.emitter.emit('change', true);
  }
}
