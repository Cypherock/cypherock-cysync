import {
  IEntity,
  IGetOptions,
  IRepository,
  DatabaseError,
  DatabaseErrorType,
  ListenerType,
  ListenerFunction,
} from '@cypherock/db-interfaces';
import { Database } from 'better-sqlite3';
import EventEmitter from 'events';
import { v4 as uuidv4 } from 'uuid';
import { ZodObject } from 'zod';
import * as sqlParser from './utils/sqlParser';
import { getValidators } from './utils/schemaValidator';
import { ITableSchema } from './utils/types';
import logger from '../utils/logger';

export class Repository<Entity extends IEntity> implements IRepository<Entity> {
  private readonly db: Database;

  private readonly name: string;

  private readonly schema: ITableSchema<Entity>;

  private readonly schemaValidator: ZodObject<any>;

  private readonly optionsValidator: ZodObject<any>;

  private readonly emitter = new EventEmitter();

  private version: number | undefined;

  constructor(db: Database, name: string, schema: ITableSchema<Entity>) {
    this.db = db;
    this.name = name;
    this.schema = schema;
    const { schemaValidator, optionsValidator } = getValidators(schema);
    this.schemaValidator = schemaValidator;
    this.optionsValidator = optionsValidator;
    this.createTableIfNotExists();
  }

  insert(entities: Entity[]): Promise<Entity[]>;

  insert(entity: Entity): Promise<Entity>;

  async insert(entityLike: Entity | Entity[]): Promise<Entity[] | Entity> {
    this.validateInput(entityLike, true);
    const entities = this.getVersionedEntities(entityLike).map(entity => ({
      ...entity,
      __id: uuidv4(),
    }));

    let changes = 0;
    try {
      changes = sqlParser.insertObjects(
        this.name,
        this.db,
        this.schema,
        entities,
      );
    } catch (error: any) {
      throw new DatabaseError(
        DatabaseErrorType.UPDATE_FAILED,
        `Couldn't insert data [${error.code}]: ${error.message}`,
      );
    }

    if (changes === 0) throw new DatabaseError(DatabaseErrorType.INSERT_FAILED);
    this.emitChange();

    const inserted = await this.getAll(
      entities.map(
        entity =>
          ({
            __id: entity.__id,
            __version: entity.__version,
          } as unknown as Partial<Entity>),
      ),
    );
    return Array.isArray(entityLike) ? inserted : inserted[0];
  }

  async update(
    filter: Partial<Entity> | Partial<Entity>[] | undefined,
    updateEntity: Partial<Entity>,
    options?: IGetOptions<Entity>,
  ): Promise<Entity[]> {
    this.validateInput(updateEntity, false, options);
    const entity = this.getVersionedEntities(updateEntity)[0];
    const matches = await this.getAll(filter, options);
    const ids = matches.map(match => match.__id);
    const { __id, ...rest } = entity;

    if (__id) logger.warn('Unnecessary __id field provided for updating');

    let changes = 0;
    try {
      changes = sqlParser.updateObjects(
        this.name,
        this.db,
        this.schema,
        ids,
        rest,
      );
    } catch (error: any) {
      throw new DatabaseError(
        DatabaseErrorType.UPDATE_FAILED,
        `Couldn't update data [${error.code}]: ${error.message}`,
      );
    }
    if (changes === 0 && ids.length > 0) {
      logger.debug(
        `Couldn't update entities with ids : ${ids} with ${JSON.stringify(
          entity,
        )}`,
      );
      throw new DatabaseError(DatabaseErrorType.UPDATE_FAILED);
    }
    if (changes > 0) this.emitChange();

    const updatedIds = matches.map(match => ({
      __id: match.__id,
      __version: rest.__version,
    }));

    return this.getAll(updatedIds as any);
  }

  private createTableIfNotExists(): void {
    try {
      sqlParser.createTable(this.name, this.db, this.schema);
    } catch (error: any) {
      throw new DatabaseError(
        DatabaseErrorType.DATABASE_CREATION_FAILED,
        `Couldn't create tables [${error.code}]: ${error.message}`,
      );
    }
  }

  private validateInput(
    entityLike: Partial<Entity>[] | Partial<Entity>,
    isNotPartial?: boolean,
    options?: IGetOptions<Entity>,
  ): void {
    const entityArray = Array.isArray(entityLike) ? entityLike : [entityLike];
    if (entityArray.length === 0 && isNotPartial)
      throw new DatabaseError(
        DatabaseErrorType.INPUT_VALIDATION_FAILED,
        `At least one entity should be present in the given array`,
      );

    if (options) {
      const result = this.optionsValidator.safeParse(options);
      if (!result.success)
        throw new DatabaseError(
          DatabaseErrorType.INPUT_VALIDATION_FAILED,
          `Invalid options provided for ${this.name} : ${result.error}`,
        );
    }
    for (const entity of entityArray) {
      let result;
      if (isNotPartial) result = this.schemaValidator.safeParse(entity);
      else result = this.schemaValidator.partial().safeParse(entity);
      if (!result.success)
        throw new DatabaseError(
          DatabaseErrorType.INPUT_VALIDATION_FAILED,
          `Invalid entity provided for ${this.name} : ${result.error}`,
        );
    }
  }

  async remove(
    entityLike?: Partial<Entity>[] | Partial<Entity>,
    options?: IGetOptions<Entity>,
  ): Promise<Entity[]> {
    const rows = await this.getAll(entityLike, options);
    const ids = rows.map(row => row.__id);

    let changes = 0;
    try {
      changes = sqlParser.removeObjects(this.name, this.db, ids);
    } catch (error: any) {
      throw new DatabaseError(
        DatabaseErrorType.REMOVE_FAILED,
        `Couldn't remove data [${error.code}]: ${error.message}`,
      );
    }
    if (changes === 0 && ids.length > 0)
      throw new DatabaseError(DatabaseErrorType.REMOVE_FAILED);
    if (changes > 0) this.emitChange();
    return rows;
  }

  async getAll(
    entityLike?: Partial<Entity>[] | Partial<Entity>,
    options?: IGetOptions<Entity>,
  ): Promise<(Entity & Required<IEntity>)[]> {
    if (entityLike) this.validateInput(entityLike, false, options);
    const entities = entityLike ? this.getVersionedEntities(entityLike) : [];

    let result = [];
    try {
      result = sqlParser.selectObjects(
        this.name,
        this.db,
        this.schema,
        entities,
        options,
      );
    } catch (error: any) {
      throw new DatabaseError(
        DatabaseErrorType.REMOVE_FAILED,
        `Couldn't select data [${error.code}]: ${error.message}`,
      );
    }

    return sqlParser.getInterfaceObj(result, this.schema) as any;
  }

  async getOne(
    entityLike: Partial<Entity>[] | Partial<Entity>,
    options?: IGetOptions<Entity>,
  ): Promise<(Entity & Required<IEntity>) | undefined> {
    return (await this.getAll(entityLike, { ...options, limit: 1 }))[0];
  }

  private getVersionedEntities(
    entityLike: Partial<Entity> | Partial<Entity>[],
  ): (Partial<Entity> & { __version: number })[] {
    const isArray = Array.isArray(entityLike);
    const entityArray = isArray ? entityLike : [entityLike];
    const versionError = (entity: Partial<Entity>) =>
      new DatabaseError(
        DatabaseErrorType.VERSION_NOT_SPECIFIED,
        `No version specified in ${JSON.stringify(entity)}`,
      );
    const result = [];
    for (const item of entityArray) {
      const version = item.__version ?? this.version;
      if (version === undefined) throw versionError(item);
      result.push({ ...item, __version: version });
    }
    return result;
  }

  addListener(type: ListenerType, listener: ListenerFunction): void {
    this.emitter.addListener(type, listener);
  }

  removeListener(type: ListenerType, listener: ListenerFunction): void {
    this.emitter.removeListener(type, listener);
  }

  removeAllListener(type?: ListenerType): void {
    this.emitter.removeAllListeners(type);
  }

  setVersion(version: number): void {
    this.version = version;
  }

  emitChange() {
    this.emitter.emit('change', true);
  }
}
