import { IEntity, IGetOptions, IRepository } from '@cypherock/db-interfaces';
import { Database } from 'better-sqlite3';
import EventEmitter from 'events';
import { v4 as uuidv4 } from 'uuid';
import { ZodObject } from 'zod';
import { sqlParser } from './utils/sqlGenerator';
import { getValidatorSchema } from './utils/schemaValidator';
import { ITableSchema } from './utils/types';

export class Repository<Entity extends IEntity> implements IRepository<Entity> {
  private readonly db: Database;

  private readonly name: string;

  private readonly schema: ITableSchema<Entity>;

  private readonly validatorSchema: ZodObject<any>;

  private version: number | undefined;

  private readonly emitter = new EventEmitter();

  constructor(db: Database, name: string, schema: ITableSchema<Entity>) {
    this.db = db;
    this.name = name;
    this.schema = schema;
    this.validatorSchema = getValidatorSchema(schema);
    this.createTableIfNotExists();
  }

  insert(entities: Partial<Entity>[]): Promise<Entity[]>;

  insert(entity: Partial<Entity>): Promise<Entity>;

  async insert(
    entityLike: Partial<Entity> | Partial<Entity>[],
  ): Promise<Entity[] | Entity> {
    const entities = this.getVersionedEntities(entityLike);
    const result: Entity[] = [];

    for (const entity of entities) {
      const { __id, ...rest } = entity as Entity;

      if (!__id) {
        const id = uuidv4();
        const statement = sqlParser.getInsertStatement(
          this.name,
          Object.keys(rest),
        );
        const { changes } = this.db
          .prepare(statement)
          .run(id, sqlParser.getValuesForSqlite(rest));
        if (changes === 0) {
          throw new Error(`Entity could not be inserted`);
        } else {
          this.emitChange();
        }

        const inserted = await this.getOne({
          ...rest,
          __id: id,
        } as any);
        if (inserted) result.push(inserted);
      }
    }

    return Array.isArray(entityLike) ? result : result[0];
  }

  async update(
    updateEntity: Partial<Entity>,
    searchEntityLike?: Partial<Entity> | Partial<Entity>[] | undefined,
  ): Promise<Entity[]> {
    const entity = this.getVersionedEntities(updateEntity)[0];
    const matches = await this.getAll(searchEntityLike);
    const ids = matches.map(match => match.__id ?? '');
    const { __id, ...rest } = entity;
    const statement = sqlParser.getUpdateStatement(
      this.name,
      Object.keys(rest),
      ids,
    );
    const { changes } = this.db
      .prepare(statement)
      .run(sqlParser.getValuesForSqlite(rest), ids);

    if (changes === 0) {
      throw new Error(`Entity with id ${__id} not found`);
    } else {
      this.emitChange();
    }

    const updatedIds: Partial<IEntity>[] = matches.map(match => ({
      __id: match.__id,
      __version: rest.__version,
    }));

    return this.getAll(updatedIds as any);
  }

  private createTableIfNotExists(): void {
    const values = sqlParser.getSqlTypes(this.schema);
    const statement = sqlParser.getCreateStatement(this.name, values);
    this.db.prepare(statement).run();
  }

  private validateInput(entityLike: Partial<Entity>[] | Partial<Entity>): void {
    const entityArray = Array.isArray(entityLike) ? entityLike : [entityLike];
    for (const entity of entityArray) {
      const result = this.validatorSchema.partial().safeParse(entity);
      if (!result.success)
        throw new Error(
          `Invalid entity provided for ${this.name}.\n${result.error}`,
        );
    }
  }

  remove(entityLikes: Partial<Entity>[]): Promise<Entity[]>;

  remove(entityLike: Partial<Entity>): Promise<Entity | undefined>;

  async remove(
    entityLike?: Partial<Entity>[] | Partial<Entity>,
    options?: IGetOptions<Entity>,
  ): Promise<Entity[] | Entity | undefined> {
    const rows = await this.getAll(entityLike, options);
    const ids = rows.map(row => row.__id ?? '');

    const statement = sqlParser.getDeleteStatement(this.name, ids);
    const { changes } = this.db.prepare(statement).run(ids);
    if (changes === 0) {
      throw new Error(`Couldn't delete any rows`);
    } else {
      this.emitChange();
    }

    return Array.isArray(entityLike) ? rows : rows[0];
  }

  async getAll(
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
      .all(
        entities.flatMap(entity => sqlParser.getValuesForSqlite(entity)),
      ) as any;
    return sqlParser.getInterfaceObj(result, this.schema);
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
