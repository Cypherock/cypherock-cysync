import EventEmitter from 'events';

import {
  IEntity,
  IGetOptions,
  IRepository,
  DatabaseError,
  DatabaseErrorType,
  ListenerType,
  ListenerFunction,
} from '@cypherock/db-interfaces';
import lodash from 'lodash';
import { v4 as uuidv4 } from 'uuid';
import { ZodObject } from 'zod';

import { getValidators } from './utils/schemaValidator';
import { ITableSchema } from './utils/types';

import { EncryptedDB } from '../encryptedDb';
import { isSubsetOf } from '../utils/isSubset';
import logger from '../utils/logger';

export class Repository<Entity extends IEntity> implements IRepository<Entity> {
  private readonly encDb: EncryptedDB;

  private readonly name: string;

  private readonly schemaValidator: ZodObject<any>;

  private readonly optionsValidator: ZodObject<any>;

  private readonly emitter = new EventEmitter();

  private version: number | undefined;

  protected constructor(
    encDb: EncryptedDB,
    name: string,
    schema: ITableSchema<Entity>,
  ) {
    this.encDb = encDb;
    this.name = name;
    const { schemaValidator, optionsValidator } = getValidators(schema);
    this.schemaValidator = schemaValidator;
    this.optionsValidator = optionsValidator;
  }

  public static async create<T extends IEntity>(
    encDb: EncryptedDB,
    name: string,
    schema: ITableSchema<T>,
  ) {
    return new Repository<T>(encDb, name, schema);
  }

  insert(entities: Entity[]): Promise<Entity[]>;

  insert(entity: Entity): Promise<Entity>;

  async insert(entityLike: Entity | Entity[]): Promise<Entity[] | Entity> {
    this.validateInput(entityLike, true);
    const entities = this.getVersionedEntities(entityLike).map(entity => ({
      ...entity,
      __id: entity.__id ?? uuidv4(),
    }));

    const collection = await this.getCollection();
    try {
      collection.insert(entities);
    } catch (error: any) {
      throw new DatabaseError(
        DatabaseErrorType.UPDATE_FAILED,
        `Couldn't insert data [${error.code}]: ${error.message}`,
      );
    }

    this.emitChange();

    const inserted = await this.getAll(
      entities.map(
        e =>
          ({
            __id: e.__id,
            __version: e.__version,
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

    const rows = await this.getAll(filter, options);
    const ids = rows.map(row => row.__id);

    const entity = this.getVersionedEntities(updateEntity)[0];
    const { __id, ...rest } = entity;

    if (__id) logger.warn('Unnecessary __id field provided for updating');

    const collection = await this.getCollection();

    try {
      collection.updateWhere(
        e => (e.__id ? ids.includes(e.__id) : false),
        e => ({
          ...e,
          ...rest,
        }),
      );
    } catch (error: any) {
      throw new DatabaseError(
        DatabaseErrorType.UPDATE_FAILED,
        `Couldn't update data [${error.code}]: ${error.message}`,
      );
    }

    this.emitChange();

    return this.getAll(
      ids.map(
        e =>
          ({
            __id: e,
          } as unknown as Partial<Entity>),
      ),
      options,
    );
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

    const collection = await this.getCollection();
    try {
      collection.removeWhere(e => (e.__id ? ids.includes(e.__id) : false));
    } catch (error: any) {
      throw new DatabaseError(
        DatabaseErrorType.REMOVE_FAILED,
        `Couldn't remove data [${error.code}]: ${error.message}`,
      );
    }
    this.emitChange();
    return rows;
  }

  async getAll(
    entityLike?: Partial<Entity>[] | Partial<Entity>,
    options?: IGetOptions<Entity>,
  ): Promise<(Entity & Required<IEntity>)[]> {
    if (entityLike) this.validateInput(entityLike, false, options);
    const entities = entityLike ? this.getVersionedEntities(entityLike) : [{}];

    let result = [];
    const collection = await this.getCollection();

    try {
      for (const ent of entities) {
        const res = collection.chain().where(d => isSubsetOf(ent, d));

        if (res) {
          result.push(...res.data());
        }
      }
    } catch (error: any) {
      throw new DatabaseError(
        DatabaseErrorType.REMOVE_FAILED,
        `Couldn't select data [${error.code}]: ${error.message}`,
      );
    }

    if (options?.sortBy) {
      result = lodash.orderBy(
        result,
        [options.sortBy.key],
        [options.sortBy.descending ? 'desc' : 'asc'],
      );
    }

    if (options?.limit) {
      result = result.slice(0, options.limit);
    }

    return lodash.uniqBy(result, e => e.__id) as any;
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
      const obj: any = { ...item, __version: version };

      // Remove Loki specific details if present
      delete obj.$loki;
      delete obj.meta;

      result.push(obj);
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

  private emitChange() {
    this.encDb.onChange();
    this.emitter.emit('change', true);
  }

  private async getCollection() {
    const db = await this.encDb.getDB();
    const collection = db.getCollection<IEntity>(this.name);

    if (collection) {
      return collection;
    }

    return db.addCollection<IEntity>(this.name, { unique: ['__id'] });
  }
}
