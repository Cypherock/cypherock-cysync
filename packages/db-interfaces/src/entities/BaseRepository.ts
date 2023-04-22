/**
 * Interface of the simple literal object with any string keys.
 */
export type ObjectLiteral = Record<string, any>;

/**
 * Special options passed to Repository methods.
 */
export interface IRepoOptions {
	/**
	 * Breaks save execution into chunks of a given size.
	 * For example, if you want to save 100,000 objects but you have issues with saving them,
	 * you can break them into 10 groups of 10,000 objects (by setting { chunk: 10000 }) and save each group separately.
	 * This option is needed to perform very big insertions when you have issues with underlying driver parameter number limitation.
	 */
	chunk?: number;
}

export interface IBaseRepository<Entity extends ObjectLiteral> {
	/**
	 * Creates a new entity instance.
	 */
	create(): Entity;
	/**
	 * Creates new entities and copies all entity properties from given objects into their new entities.
	 * Note that it copies only properties that are present in entity schema.
	 */
	create(entityLikeArray: Partial<Entity>[]): Entity[];
	/**
	 * Creates a new entity instance and copies all entity properties from this object into a new entity.
	 * Note that it copies only properties that are present in entity schema.
	 */
	create(entityLike: Partial<Entity>): Entity;
	/**
	 * Saves all given entities in the database.
	 * If entities do not exist in the database then inserts, otherwise updates.
	 */
	save<T extends Partial<Entity>>(
		entities: T[],
		options: IRepoOptions & {
			reload: false;
		}
	): Promise<T[]>;
	/**
	 * Saves all given entities in the database.
	 * If entities do not exist in the database then inserts, otherwise updates.
	 */
	save<T extends Partial<Entity>>(
		entities: T[],
		options?: IRepoOptions
	): Promise<(T & Entity)[]>;
	/**
	 * Saves a given entity in the database.
	 * If entity does not exist in the database then inserts, otherwise updates.
	 */
	save<T extends Partial<Entity>>(
		entity: T,
		options: IRepoOptions & {
			reload: false;
		}
	): Promise<T>;
	/**
	 * Saves a given entity in the database.
	 * If entity does not exist in the database then inserts, otherwise updates.
	 */
	save<T extends Partial<Entity>>(
		entity: T,
		options?: IRepoOptions
	): Promise<T & Entity>;
	/**
	 * Removes a given entities from the database.
	 */
	remove(entities: Entity[], options?: IRepoOptions): Promise<Entity[]>;
	/**
	 * Removes a given entity from the database.
	 */
	remove(entity: Entity, options?: IRepoOptions): Promise<Entity>;
	/**
	 * Records the delete date of all given entities.
	 */
	softRemove<T extends Partial<Entity>>(
		entities: T[],
		options: IRepoOptions & {
			reload: false;
		}
	): Promise<T[]>;
	/**
	 * Records the delete date of all given entities.
	 */
	softRemove<T extends Partial<Entity>>(
		entities: T[],
		options?: IRepoOptions
	): Promise<(T & Entity)[]>;
	/**
	 * Records the delete date of a given entity.
	 */
	softRemove<T extends Partial<Entity>>(
		entity: T,
		options: IRepoOptions & {
			reload: false;
		}
	): Promise<T>;
	/**
	 * Records the delete date of a given entity.
	 */
	softRemove<T extends Partial<Entity>>(
		entity: T,
		options?: IRepoOptions
	): Promise<T & Entity>;

	/**
	 * Fetches entities from given object from the repository.
	 */
	getAll(entityLike: Partial<Entity>): Entity[];

	/**
	 * Fetches first entity from given object from the repository.
	 */
	getOne(entityLike: Partial<Entity>): Entity;
}
