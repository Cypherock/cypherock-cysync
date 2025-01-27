import AsyncStorage, {
  AsyncStorageStatic,
} from '@react-native-async-storage/async-storage';
import { IKeyValueStore } from '@cypherock/db-interfaces';

export class KeyValueStore implements IKeyValueStore {
  db: AsyncStorageStatic;

  constructor() {
    this.db = AsyncStorage;
  }

  async getItem(keyName: string): Promise<string | null> {
    try {
      return await this.db.getItem(keyName);
    } catch (error: any) {
      throw new Error(`Couldn't get item [${error.code}]: ${error.message}`);
    }
  }

  async setItem(keyName: string, keyValue: string): Promise<void> {
    try {
      return await this.db.setItem(keyName, keyValue);
    } catch (error: any) {
      throw new Error(`Couldn't set item [${error.code}]: ${error.message}`);
    }
  }

  async removeItem(keyName: string): Promise<void> {
    try {
      return await this.db.removeItem(keyName);
    } catch (error: any) {
      throw new Error(`Couldn't remove item [${error.code}]: ${error.message}`);
    }
  }

  async clear(): Promise<void> {
    await this.db.clear();
  }

  async close(): Promise<void> {
    // No specific close operation for AsyncStorage, but method is required by interface
    return Promise.resolve();
  }
}
