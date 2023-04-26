/**
 * These fields should be available in every entity
 */
export interface IBaseEntity {
  __id: string;
  __version: number;
}
export interface IGetOptions<T> {
  /**
   * Sorts the results according to this key
   */
  orderBy?: keyof T;
  descending?: boolean;
  /**
   * Returns any entry that is superset of any entries in the list
   */
  match?: Partial<T>[];
  /**
   * Limits number of entries to be returned
   */
  limit?: number;
}
/**
 * Interface of the simple literal object with any string keys.
 */
export type ObjectLiteral = Record<string, any>;

/**
 * Special options passed to Repository methods.
 */

export interface IBaseRepository<Entity extends ObjectLiteral> {
  /**
   * Creates new entities and copies all entity properties from given objects into their new entities.
   * Note that it copies only properties that are present in entity schema.
   */
  instantiate(entityLikeArray: Partial<Entity>[]): Entity[];
  /**
   * Creates a new entity instance and copies all entity properties from this object into a new entity.
   * Note that it copies only properties that are present in entity schema.
   */
  instantiate(entityLike?: Partial<Entity>): Entity;
  /**
   * Saves all given entities in the database.
   * If entities do not exist in the database then inserts, otherwise updates.
   */
  insertOrUpdate<T extends Partial<Entity>>(entities: T[]): Promise<T[]>;
  /**
   * Saves a given entity in the database.
   * If entity does not exist in the database then inserts, otherwise updates.
   */
  insertOrUpdate<T extends Partial<Entity>>(entity: T): Promise<T>;
  /**
   * Removes a given entities from the database.
   */
  remove(entities: Entity[]): Promise<Entity[]>;
  /**
   * Removes a given entity from the database.
   */
  remove(entity: Entity): Promise<Entity>;
  /**
   * Records the delete date of all given entities.
   */
  softRemove<T extends Partial<Entity>>(entities: T[]): Promise<T[]>;
  /**
   * Records the delete date of a given entity.
   */
  softRemove<T extends Partial<Entity>>(entity: T): Promise<T>;

  /**
   * Fetches all entities from given object from the repository.
   */
  getAll(entityLike: Partial<Entity>, options?: IGetOptions<Entity>): Entity[];

  /**
   * Fetches first entity from given object from the repository.
   */
  getOne(entityLike: Partial<Entity>, options?: IGetOptions<Entity>): Entity;

  /**
   * Adds a listener to the repository for any changes
   * the callback function is executed whenever there is a change in the repository
   */
  addListener(callback: () => void): void;

  /**
   * Removes previously added listener with the given callback function if it exists
   */
  removeListener(callback: () => void): void;
}
