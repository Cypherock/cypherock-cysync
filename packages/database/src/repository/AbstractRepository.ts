import { IGetOptions, IRepository } from '@cypherock/db-interfaces';
import { EventEmitter } from 'events';
import { ObjectLiteral, Repository } from 'typeorm';

export class BaseRepository<Entity extends ObjectLiteral>
  implements IRepository<Entity>
{
  private readonly repository: Repository<Entity>;

  private readonly emitter = new EventEmitter();

  instantiate(entityLikeArray: Partial<Entity>[]): Entity[];

  instantiate(entityLike?: Partial<Entity> | undefined): Entity;

  instantiate(
    entityLike?: Partial<Entity> | Partial<Entity>[],
  ): Entity | Entity[] {
    return this.repository.create(entityLike as any);
  }

  insertOrUpdate<T extends Partial<Entity>>(entities: T[]): Promise<T[]>;

  insertOrUpdate<T extends Partial<Entity>>(entity: T): Promise<T>;

  insertOrUpdate<T extends Partial<Entity>>(
    entity: unknown,
  ): Promise<T[]> | Promise<T> {
    return this.repository.save(entity as any);
  }

  remove(entities: Entity[]): Promise<Entity[]>;

  remove(entity: Entity): Promise<Entity>;

  remove(entity: unknown): Promise<Entity[]> | Promise<Entity> {
    return this.repository.save(entity as any);
  }

  softRemove<T extends Partial<Entity>>(entities: T[]): Promise<T[]>;

  softRemove<T extends Partial<Entity>>(entity: T): Promise<T>;

  softRemove<T extends Partial<Entity>>(
    entity: unknown,
  ): Promise<T[]> | Promise<T> {
    return this.repository.softRemove(entity as any);
  }

  getAll(
    entityLike: Partial<Entity>,
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

    return this.repository.find({
      where: options?.match ?? entityLike,
      order,
      take: limit,
    });
  }

  async getOne(
    entityLike: Partial<Entity>,
    options?: IGetOptions<Entity> | undefined,
  ): Promise<Entity | undefined> {
    let order: any | undefined;
    if (options?.sortBy) {
      order = {};
      order[options.sortBy.key.toString()] = options.sortBy.descending
        ? 'DESC'
        : 'ASC';
    }

    const result = await this.repository.findOne({
      where: options?.match ?? entityLike,
      order,
    });

    return result ?? undefined;
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
}
