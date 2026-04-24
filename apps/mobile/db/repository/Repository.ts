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

  private listenerResults?: Realm.Results<T & Realm.Object>;

  constructor(realm: Realm, name: string) {
    this.realm = realm;
    this.name = name;
  }

  public static async create<T extends IEntity>(
    realm: Realm,
    name: string,
    _schema: Realm.ObjectSchema,
  ): Promise<Repository<T>> {
    return new Repository<T>(realm, name);
  }

  async insert(entity: T): Promise<T>;
  async insert(entities: T[]): Promise<T[]>;
  async insert(entityOrEntities: T | T[]): Promise<T | T[]> {
    try {
      const isBulk = Array.isArray(entityOrEntities);
      const inputs = isBulk ? entityOrEntities : [entityOrEntities];

      const payloads = inputs.map(e =>
        this.stripUndefined({ ...e, __id: e.__id || uuidv4() }),
      );

      const created: T[] = new Array(payloads.length);
      this.realm.write(() => {
        for (let i = 0; i < payloads.length; i++) {
          const obj = this.realm.create(
            this.name,
            payloads[i] as unknown as Record<string, unknown>,
            Realm.UpdateMode.Modified,
          ) as unknown as Realm.Object;
          created[i] = obj.toJSON() as unknown as T;
        }
      });

      return isBulk ? created : created[0];
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
      const liveResults = this.findObjects(filter);
      const ids: string[] = [];
      for (let i = 0; i < liveResults.length; i++) {
        const id = (liveResults[i] as unknown as IEntity).__id;
        if (id) ids.push(id);
      }

      if (ids.length === 0) return [];

      const { __id: _ignore, ...rest } = updateEntity;
      const cleaned = this.stripUndefined(rest);

      const snapshots: T[] = [];
      this.realm.write(() => {
        for (const id of ids) {
          const fresh = this.realm
            .objects<T>(this.name)
            .filtered('__id == $0', id);
          if (fresh.length === 0) continue;

          const obj = fresh[0] as unknown as Realm.Object & T;
          if (cleaned && typeof cleaned === 'object') {
            Object.assign(obj, cleaned);
          }
          snapshots.push(obj.toJSON() as unknown as T);
        }
      });
      return snapshots;
    } catch (error: any) {
      throw new DatabaseError(
        DatabaseErrorType.UPDATE_FAILED,
        `Failed to update: ${error.message}`,
      );
    }
  }

  async remove(
    filter?: Partial<T> | Partial<T>[],
    _options?: IGetOptions<T>,
  ): Promise<T[]> {
    try {
      const liveResults = this.findObjects(filter);
      const ids: string[] = [];
      const snapshots: T[] = [];
      for (let i = 0; i < liveResults.length; i++) {
        snapshots.push(liveResults[i].toJSON() as unknown as T);
        const id = (liveResults[i] as unknown as IEntity).__id;
        if (id) ids.push(id);
      }

      if (ids.length === 0) return [];

      this.realm.write(() => {
        const toDelete = this.realm
          .objects<T>(this.name)
          .filtered(
            ids.map((_, idx) => `__id == $${idx}`).join(' OR '),
            ...ids,
          );
        this.realm.delete(toDelete);
      });

      return snapshots;
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
      let result: Realm.Results<T & Realm.Object> = this.findObjects(filter);

      if (options?.sortBy) {
        const { key, descending } = options.sortBy;
        result = result.sorted(
          key.toString(),
          descending,
        ) as unknown as Realm.Results<T & Realm.Object>;
      }

      const limit = options?.limit ?? result.length;

      const out: (T & Required<IEntity>)[] = new Array(
        Math.min(limit, result.length),
      );
      for (let i = 0; i < out.length; i++) {
        out[i] = result[i].toJSON() as unknown as T & Required<IEntity>;
      }
      return out;
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
    try {
      let result: Realm.Results<T & Realm.Object> = this.findObjects(filter);
      if (options?.sortBy) {
        result = result.sorted(
          options.sortBy.key.toString(),
          options.sortBy.descending,
        ) as unknown as Realm.Results<T & Realm.Object>;
      }
      const first = result[0];
      return first
        ? (first.toJSON() as unknown as T & Required<IEntity>)
        : undefined;
    } catch (error: any) {
      throw new DatabaseError(
        DatabaseErrorType.GET_FAILED,
        `Failed to get: ${error.message}`,
      );
    }
  }

  private findObjects(
    filter?: Partial<T> | Partial<T>[],
  ): Realm.Results<T & Realm.Object> {
    const all = this.realm.objects<T>(this.name) as unknown as Realm.Results<
      T & Realm.Object
    >;

    if (filter === undefined) return all;

    const filters = Array.isArray(filter) ? filter : [filter];
    if (filters.length === 0) {
      return all.filtered('FALSEPREDICATE') as unknown as Realm.Results<
        T & Realm.Object
      >;
    }

    const args: unknown[] = [];
    const orClauses: string[] = [];

    for (const f of filters) {
      const keys = Object.keys(f);
      if (keys.length === 0) continue;

      const andClauses: string[] = [];
      for (const key of keys) {
        const value = (f as Record<string, unknown>)[key];
        if (value === null || value === undefined) {
          andClauses.push(`${key} == null`);
        } else {
          andClauses.push(`${key} == $${args.length}`);
          args.push(value);
        }
      }
      orClauses.push(`(${andClauses.join(' AND ')})`);
    }

    if (orClauses.length === 0) {
      return all.filtered('FALSEPREDICATE') as unknown as Realm.Results<
        T & Realm.Object
      >;
    }

    return all.filtered(
      orClauses.join(' OR '),
      ...args,
    ) as unknown as Realm.Results<T & Realm.Object>;
  }

  private stripUndefined<U>(value: U): U {
    if (value === null || value === undefined) return value;

    if (Array.isArray(value)) {
      return value
        .filter(item => item !== undefined)
        .map(item => this.stripUndefined(item)) as unknown as U;
    }

    if (typeof value === 'object' && !(value instanceof Date)) {
      const out: Record<string, unknown> = {};
      for (const k of Object.keys(value as object)) {
        const v = (value as Record<string, unknown>)[k];
        if (v !== undefined) {
          out[k] = this.stripUndefined(v);
        }
      }
      return out as U;
    }

    return value;
  }

  addListener(_type: 'change', listener: (...args: any[]) => void): void {
    if (!this.listenerResults) {
      this.listenerResults = this.realm.objects<T>(
        this.name,
      ) as unknown as Realm.Results<T & Realm.Object>;
    }
    this.listenerResults.addListener(listener);
  }

  removeListener(_type: 'change', listener: (...args: any[]) => void): void {
    this.listenerResults?.removeListener(listener);
  }

  removeAllListener(type?: 'change'): void {
    this.listenerResults?.removeAllListeners();
    this.realm.removeAllListeners(type);
    this.listenerResults = undefined;
  }

  setVersion(version: number): void {
    this.version = version;
  }
}
