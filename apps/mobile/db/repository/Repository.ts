import {
  IRepository,
  IEntity,
  IGetOptions,
  DatabaseError,
  DatabaseErrorType,
} from '@cypherock/db-interfaces';
import Realm from 'realm';
import { v4 as uuidv4 } from 'uuid';

export class Repository<T extends IEntity> implements IRepository<T> {
  protected realm: Realm;
  protected name: string;
  private version?: number;

  constructor(realm: Realm, name: string) {
    this.realm = realm;
    this.name = name;
  }

  public static async create<T extends IEntity>(
    realm: Realm,
    name: string,
    schema: Realm.ObjectSchema,
  ): Promise<Repository<T>> {
    return new Repository<T>(realm, name);
  }

  async insert(entity: T): Promise<T>;
  async insert(entities: T[]): Promise<T[]>;
  async insert(entityOrEntities: T | T[]): Promise<T | T[]> {
    try {
      let result: T | T[];

      this.realm.write(() => {
        if (Array.isArray(entityOrEntities)) {
          result = entityOrEntities.map(entity => {
            const obj = this.removeUndefinedValues({
              ...entity,
              __id: entity.__id || uuidv4(),
            }) as Record<string, unknown>;
            return this.realm.create(
              this.name,
              obj,
              Realm.UpdateMode.Modified,
            ) as unknown as T;
          });
        } else {
          const obj = this.removeUndefinedValues({
            ...entityOrEntities,
            __id: entityOrEntities.__id || uuidv4(),
          }) as Record<string, unknown>;
          result = this.realm.create(
            this.name,
            obj,
            Realm.UpdateMode.Modified,
          ) as unknown as T;
        }
      });

      return result!;
    } catch (error: any) {
      throw new DatabaseError(
        DatabaseErrorType.INSERT_FAILED,
        `Failed to insert: ${error.message}`,
      );
    }
  }

  async update(
    filter: Partial<T> | Partial<T>[] | undefined,
    updateEntity: Partial<T>,
  ): Promise<T[]> {
    try {
      const objects = await this.findObjects(filter);

      this.realm.write(() => {
        objects.forEach(obj => {
          const { __id, ...otherUpdates } = updateEntity;
          const cleanedUpdates = this.removeUndefinedValues(
            otherUpdates as Record<string, unknown>,
          );
          if (
            cleanedUpdates !== undefined &&
            cleanedUpdates !== null &&
            typeof cleanedUpdates === 'object'
          ) {
            Object.assign(obj, cleanedUpdates);
          }
        });
      });

      return Array.from(objects);
    } catch (error: any) {
      throw new DatabaseError(
        DatabaseErrorType.UPDATE_FAILED,
        `Failed to update: ${error.message}`,
      );
    }
  }

  private removeUndefinedValues(value: unknown): unknown {
    if (value === undefined) return undefined;
    if (value === null) return null;
    if (value instanceof Date) return value;
    if (Array.isArray(value)) {
      return value
        .map(v => this.removeUndefinedValues(v))
        .filter(v => v !== undefined);
    }
    if (typeof value !== 'object') return value;

    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>)
        .map(([key, val]) => [key, this.removeUndefinedValues(val)] as const)
        .filter(([, val]) => val !== undefined),
    );
  }

  async remove(
    filter?: Partial<T> | Partial<T>[],
    options?: IGetOptions<T>,
  ): Promise<T[]> {
    try {
      const objects = await this.findObjects(filter);
      const deletedObjects = Array.from(objects);

      this.realm.write(() => {
        this.realm.delete(objects);
      });

      return deletedObjects;
    } catch (error: any) {
      throw new DatabaseError(
        DatabaseErrorType.REMOVE_FAILED,
        `Failed to remove: ${error.message}`,
      );
    }
  }

  async getAll(
    filter?: Partial<T> | Partial<T>[],
    options?: IGetOptions<T>,
  ): Promise<(T & Required<IEntity>)[]> {
    try {
      let result;

      const isEmptyFilter =
        !filter ||
        (Array.isArray(filter) && filter.length === 0) ||
        (!Array.isArray(filter) && Object.keys(filter).length === 0);

      if (isEmptyFilter) {
        result = this.realm.objects<T & Realm.Object>(this.name);
      } else {
        result = await this.findObjects(filter);
      }

      if (options?.sortBy) {
        const { key, descending } = options.sortBy;
        result.sorted(key.toString(), descending);
      }

      if (options?.limit) {
        return Array.from(
          result
            .slice(0, options.limit)
            .map(o => o.toJSON() as unknown as T & Required<IEntity>),
        );
      }

      return Array.from(
        result.map(o => o.toJSON() as unknown as T & Required<IEntity>),
      );
    } catch (error: any) {
      throw new DatabaseError(
        DatabaseErrorType.GET_FAILED,
        `Failed to get: ${error.message}`,
      );
    }
  }

  async getOne(
    filter: Partial<T> | Partial<T>[],
    options?: IGetOptions<T>,
  ): Promise<(T & Required<IEntity>) | undefined> {
    const results = await this.getAll(filter, { ...options, limit: 1 });
    return results[0];
  }

  private async findObjects(
    filter?: Partial<T> | Partial<T>[],
  ): Promise<Realm.Results<T & Realm.Object>> {
    if (!filter || (Array.isArray(filter) && filter.length === 0)) {
      return this.realm
        .objects<T>(this.name)
        .filtered('FALSEPREDICATE') as unknown as Realm.Results<
        T & Realm.Object
      >;
    }

    const filters = Array.isArray(filter) ? filter : [filter];

    const query = filters
      .map(f => {
        if (Object.keys(f).length === 0) {
          return null;
        }
        return Object.entries(f)
          .map(([key, value]) => {
            if (value === null || value === undefined) {
              return `${key} == null`;
            }
            if (typeof value === 'string') return `${key} == "${value}"`;
            if (typeof value === 'boolean') return `${key} == ${value}`;
            return `${key} == ${value}`;
          })
          .join(' AND ');
      })
      .filter(q => q != null)
      .join(' OR ');

    if (!query.trim()) {
      return this.realm
        .objects<T>(this.name)
        .filtered('FALSEPREDICATE') as unknown as Realm.Results<
        T & Realm.Object
      >;
    }

    return this.realm
      .objects(this.name)
      .filtered(query) as unknown as Realm.Results<T & Realm.Object>;
  }

  addListener(type: 'change', listener: (...args: any[]) => void): void {
    this.realm.objects(this.name).addListener(listener);
  }

  removeListener(type: 'change', listener: (...args: any[]) => void): void {
    this.realm.objects(this.name).removeListener(listener);
  }

  removeAllListener(type?: 'change'): void {
    this.realm.removeAllListeners(type);
  }

  setVersion(version: number): void {
    this.version = version;
  }
}
