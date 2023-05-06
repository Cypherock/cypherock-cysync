import { IGetOptions, IRepository } from '@cypherock/db-interfaces';
import { EventEmitter } from 'events';
import { ObjectLiteral, Repository } from 'typeorm';

export class BaseRepository<Entity extends ObjectLiteral>
  implements IRepository<Entity>
{
  private readonly repository: Repository<Entity>;

  private readonly emitter = new EventEmitter();

  private tableVersion: number;

  constructor(repository: Repository<Entity>) {
    this.repository = repository;
  }

  private checkVersionField(
    entityLike: Partial<Entity> | Partial<Entity>[],
  ): Partial<Entity> | Partial<Entity>[] {
    let result;
    const versionError = new Error('No version specified');
    if (Array.isArray(entityLike)) {
      result = [];
      for (const item of entityLike) {
        const version = item.__version ?? this.tableVersion;
        if (version === undefined) throw versionError;
        result.push({ ...item, __version: version });
      }
    } else {
      const version = entityLike.__version ?? this.tableVersion;
      if (version === undefined) throw versionError;
      result = { ...entityLike, __version: version };
    }
    return result;
  }

  instantiate(entityLikeArray: Partial<Entity>[]): Entity[];

  instantiate(entityLike?: Partial<Entity> | undefined): Entity;

  instantiate(
    entityLike?: Partial<Entity> | Partial<Entity>[],
  ): Entity | Entity[] {
    return this.repository.create(entityLike as any);
  }

  insertOrUpdate(entities: Partial<Entity>[]): Promise<Entity[]>;

  insertOrUpdate(entities: Partial<Entity>): Promise<Entity>;

  insertOrUpdate(
    entity: Partial<Entity> | Partial<Entity>[],
  ): Promise<Entity[] | Entity> {
    return new Promise(async (resolve, reject) => {
      try {
        const versionedEntity = this.checkVersionField(entity);
        const result = await this.repository.save(versionedEntity as any);
        this.emitChange();
        resolve(result);
      } catch (error) {
        reject(error);
      }
    });
  }

  getAll(
    entityLike?: Partial<Entity> | Partial<Entity>[],
    options?: IGetOptions<Entity> | undefined,
  ): Promise<Entity[]> {
    let order: any | undefined;
    let limit: number | undefined;
    if (options?.sortBy) {
      order = {};
      order[options.sortBy.key] = options.sortBy.descending ? 'DESC' : 'ASC';
    }

    if (options?.limit) {
      limit = options.limit;
    }

    const versionedEntityLike = entityLike
      ? this.checkVersionField(entityLike)
      : undefined;

    return this.repository.find({
      where: versionedEntityLike,
      order,
      take: limit,
    });
  }

  async getOne(
    entityLike?: Partial<Entity> | Partial<Entity>[],
    options?: IGetOptions<Entity> | undefined,
  ): Promise<Entity | undefined> {
    let order: any | undefined;
    if (options?.sortBy) {
      order = {};
      order[options.sortBy.key.toString()] = options.sortBy.descending
        ? 'DESC'
        : 'ASC';
    }

    const versionedEntityLike = entityLike
      ? this.checkVersionField(entityLike)
      : undefined;

    const result = await this.repository.findOne({
      where: versionedEntityLike,
      order,
    });

    return result ?? undefined;
  }

  remove(entityLikes: Partial<Entity>[]): Promise<Entity[]>;

  remove(entityLike: Partial<Entity>): Promise<Entity | undefined>;

  async remove(
    entityLike: Partial<Entity>[] | Partial<Entity>,
  ): Promise<Entity[] | Entity | undefined> {
    const entities = await this.getAll(entityLike);
    let removed: Entity[] | Entity | undefined;

    if (entities.length) {
      removed = await this.repository.remove(entities as any);
      this.emitChange();
    }
    return removed;
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
    this.tableVersion = version;
  }

  emitChange() {
    this.emitter.emit('change', true);
  }
}
