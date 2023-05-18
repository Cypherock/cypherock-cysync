export interface IKeyValueStore {
  /**
   * Gives the number of items stored in the Database.
   *
   * @returns The number of data items stored in a given Database.
   */
  getLength(): number;

  /**
   * When passed a number n, returns the name of the nth key in a database.
   * The order of keys is user-agent defined, so you should not rely on it.
   *
   * @param index An integer representing the number of the key you want to get the name of. This is a zero-based index.
   * @returns A string containing the name of the key. If the index does not exist, null is returned.
   */
  key(index: number): string | null;

  /**
   * When passed a key name, will return that key's value, or null if the key does not
   * exist, in the database.
   *
   * @param keyName A string containing the name of the key you want to retrieve the value of.
   * @returns A string containing the value of the key. If the key does not exist, null is returned.
   */
  getItem(keyName: string): string | null;

  /**
   * When passed a key name and value, will add that key to the database,
   * or update that key's value if it already exists.
   *
   * @param keyName A string containing the name of the key you want to create/update.
   * @param keyValue A string containing the value you want to give the key you are creating/updating.
   * @returns None
   */
  setItem(keyName: string, keyValue: string): void;

  /**
   * When passed a key name, will remove that key from the database if it exists.
   *
   * If there is no item associated with the given key, this method will do nothing.
   *
   * @param KeyName A string containing the name of the key you want to remove.
   * @returns None
   */
  removeItem(keyName: string): void;

  /**
   * Clears all keys stored in a given Database.
   *
   * @returns None
   */
  clear(): void;
}
