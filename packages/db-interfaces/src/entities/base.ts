/**
 * These fields should be available in every entity
 */
export interface IEntity {
  __id?: string;
  __version?: number;
}

export type ListenerType = 'change';
export interface IGetOptions<T> {
  /**
   * Sorts the results using the key provided
   */
  sortBy?: {
    key: keyof T;
    descending?: boolean;
  };
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

export interface IRepository<Entity extends ObjectLiteral> {
  /**
   * Saves all given entities in the database.
   * If entities do not exist in the database then inserts, otherwise updates.
   */
  insertOrUpdate(entities: Partial<Entity>[]): Promise<Entity[]>;
  /**
   * Saves a given entity in the database.
   * If entity does not exist in the database then inserts, otherwise updates.
   */
  insertOrUpdate(entity: Partial<Entity>): Promise<Entity>;
  /**
   * Removes entities matching any of the given entities from the database.
   */
  remove(entityLikes: Partial<Entity>[]): Promise<Entity[]>;
  /**
   * Removes entities matching the given entity from the database.
   */
  remove(entityLike: Partial<Entity>): Promise<Entity | undefined>;

  /**
   * Fetches all entities from given object from the repository.
   * Returns any entry in the database that is superset of any of the entries in the list provided
   */
  getAll(
    entityLike?: Partial<Entity>[] | Partial<Entity>,
    options?: IGetOptions<Entity>,
  ): Promise<Entity[]>;

  /**
   * Fetches first entity from given object from the repository.
   * Returns first entry in the database that is superset of any of the entries in the list provided
   */
  getOne(
    entityLike?: Partial<Entity>[] | Partial<Entity>,
    options?: IGetOptions<Entity>,
  ): Promise<Entity | undefined>;

  /**
   * Adds a listener to the repository for any changes denoted by type
   */
  addListener(type: ListenerType, listener: (...args: any[]) => void): void;

  /**
   * Removes previously added listener with the given listener and type function if it exists
   */
  removeListener(type: ListenerType, listener: (...args: any[]) => void): void;
  /**
   * Removes all previously added listener with the given type
   */
  removeAllListener(type?: ListenerType): void;

  /**
   * Sets version for the current repository
   * all the operations use this version as __version parameter if not provided otherwise
   */
  setVersion(version: number): void;
}
