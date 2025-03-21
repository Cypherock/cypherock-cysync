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
            const obj = { ...entity, __id: entity.__id || uuidv4() };
            return this.realm.create(
              this.name,
              obj,
              Realm.UpdateMode.Modified,
            ) as unknown as T;
          });
        } else {
          const obj = {
            ...entityOrEntities,
            __id: entityOrEntities.__id || uuidv4(),
          };
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
          Object.assign(obj, {
            ...otherUpdates,
          });
        });
      });

      return Array.from(objects);
    } catch (error: any) {
      console.log(error);
      throw new DatabaseError(
        DatabaseErrorType.UPDATE_FAILED,
        `Failed to update: ${error.message}`,
      );
    }
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
      let results = await this.findObjects(filter);

      if (options?.sortBy) {
        results = results.sorted(
          options.sortBy.key as string,
          options.sortBy.descending,
        );
      }
      if (options?.sortBy) {
        results = results.sorted(
          options.sortBy.key as string,
          options.sortBy.descending,
        );
      }

      if (options?.limit) {
        results = results.slice(0, options.limit) as unknown as Realm.Results<
          T & Realm.Object
        >;
      }

      return Array.from(results).map(result => ({
        ...result,
        __id: result.__id || uuidv4(),
        __version: result.__version ?? 0,
        meta: result.meta ?? { created: undefined },
      }));
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
    let query = '';

    if (filter) {
      const filters = Array.isArray(filter) ? filter : [filter];

      query = filters
        .map(f =>
          Object.entries(f)
            .map(([key, value]) => {
              if (!value) return `${key} == null`;
              if (typeof value === 'string') return `${key} == "${value}"`;
              if (typeof value === 'boolean') return `${key} == ${value}`;
              return `${key} == ${value}`;
            })
            .join(' AND '),
        )
        .join(' OR ');
    }

    if (!query.trim()) {
      return this.realm.objects(this.name) as unknown as Realm.Results<
        T & Realm.Object
      >;
    }

    return this.realm
      .objects(this.name)
      .filtered(query) as unknown as Realm.Results<T & Realm.Object>;
  }

  addListener(type: 'change', listener: (...args: any[]) => void): void {
    this.realm.addListener(type, listener);
  }

  removeListener(type: 'change', listener: (...args: any[]) => void): void {
    this.realm.removeListener(type, listener);
  }

  removeAllListener(type?: 'change'): void {
    this.realm.removeAllListeners(type);
  }

  setVersion(version: number): void {
    this.version = version;
  }
}
