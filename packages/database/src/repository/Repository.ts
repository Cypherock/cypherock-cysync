import {
  IEntity,
  IGetOptions,
  IRepository,
  DatabaseError,
  DatabaseErrorType,
  ListenerType,
} from '@cypherock/db-interfaces';
import { Database } from 'better-sqlite3';
import EventEmitter from 'events';
import { v4 as uuidv4 } from 'uuid';
import { ZodObject } from 'zod';
import { sqlParser } from './utils/sqlParser';
import { getValidatorSchema } from './utils/schemaValidator';
import { ITableSchema } from './utils/types';
import logger from '../utils/logger';

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
    this.validateInput(entityLike, true);
    const entities = this.getVersionedEntities(entityLike).map(entity => ({
      ...entity,
      __id: uuidv4(),
    }));

    const changes = sqlParser.insertObjects(
      this.name,
      this.db,
      this.schema,
      entities,
    );

    if (changes === 0) {
      throw new DatabaseError(DatabaseErrorType.INSERT_FAILED);
    } else {
      this.emitChange();
    }

    const inserted = await this.getAll(
      entities.map(
        entity =>
          ({
            __id: entity.__id,
            __version: entity.__version,
          } as Partial<Entity>),
      ),
    );
    return Array.isArray(entityLike) ? inserted : inserted[0];
  }

  async update(
    updateEntity: Partial<Entity>,
    searchEntityLike?: Partial<Entity> | Partial<Entity>[] | undefined,
    options?: IGetOptions<Entity>,
  ): Promise<Entity[]> {
    this.validateInput(updateEntity);
    const entity = this.getVersionedEntities(updateEntity)[0];
    const matches = await this.getAll(searchEntityLike, options);
    const ids = matches.map(match => match.__id);
    const { __id, ...rest } = entity;

    const changes = sqlParser.updateObjects(this.name, this.db, ids, rest);
    if (changes === 0) {
      logger.error(
        `Couldn't update entities with ids : ${ids} with id:${__id}`,
      );
      throw new DatabaseError(DatabaseErrorType.UPDATE_FAILED);
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
    try {
      sqlParser.createTable(this.name, this.db, this.schema);
    } catch (error) {
      throw new DatabaseError(
        DatabaseErrorType.DATABASE_CREATION_FAILED,
        `Couldn't create tables\n${error}`,
      );
    }
  }

  private validateInput(
    entityLike: Partial<Entity>[] | Partial<Entity>,
    isNotPartial?: boolean,
  ): void {
    const entityArray = Array.isArray(entityLike) ? entityLike : [entityLike];
    for (const entity of entityArray) {
      let result;
      if (isNotPartial) result = this.validatorSchema.safeParse(entity);
      else result = this.validatorSchema.partial().safeParse(entity);
      if (!result.success)
        throw new DatabaseError(
          DatabaseErrorType.INPUT_VALIDATION_FAILED,
          `Invalid entity provided for ${this.name}.\n${result.error}`,
        );
    }
  }

  remove(
    entityLikes: Partial<Entity>[],
    options?: IGetOptions<Entity>,
  ): Promise<Entity[]>;

  remove(
    entityLike: Partial<Entity>,
    options?: IGetOptions<Entity>,
  ): Promise<Entity | undefined>;

  async remove(
    entityLike?: Partial<Entity>[] | Partial<Entity>,
    options?: IGetOptions<Entity>,
  ): Promise<Entity[] | Entity | undefined> {
    const rows = await this.getAll(entityLike, options);
    const ids = rows.map(row => row.__id);

    const changes = sqlParser.removeObjects(this.name, this.db, ids);
    if (changes === 0 && ids.length > 0) {
      throw new DatabaseError(DatabaseErrorType.REMOVE_FAILED);
    } else {
      this.emitChange();
    }
    return rows.length > 1 ? rows : rows[0];
  }

  async getAll(
    entityLike?: Partial<Entity>[] | Partial<Entity>,
    options?: IGetOptions<Entity>,
  ): Promise<(Entity & Required<IEntity>)[]> {
    if (entityLike) this.validateInput(entityLike);
    const entities = entityLike ? this.getVersionedEntities(entityLike) : [];

    const result = sqlParser.selectObjects(
      this.name,
      this.db,
      entities,
      options,
    );

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
  ): Partial<Entity>[] {
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

  addListener(type: ListenerType, listener: (...args: any[]) => void): void {
    this.emitter.addListener(type, listener);
  }

  removeListener(type: ListenerType, listener: (...args: any[]) => void): void {
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
