import { IKeyValueStore } from '@cypherock/db-interfaces';
import { createDb } from '../src';
import { testHelper } from './__helpers__/testHelper';

describe('KeyValueStore', () => {
  describe('createDb', () => {
    test('Can initialize KeyValueStore', async () => {
      const db = createDb(':memory:');
      expect(db).toBeDefined();
      const devices = await db.device.getAll();
      expect(devices.length).toEqual(0);
      await db.destroy();
      expect(db.device.getAll()).rejects.toThrow();
    });
  });

  let storage!: IKeyValueStore;
  beforeAll(async () => {
    await testHelper.setupTestDB();
    storage = testHelper.db.storage;
  });

  afterAll(() => {
    testHelper.teardownTestDB();
  });

  describe('setItem', () => {
    test('Can insert a key value pair', async () => {
      const key = 'key';
      const value = 'value';
      await storage.setItem(key, value);
      const storedValue = await storage.getItem(key);
      expect(storedValue).toEqual(value);
    });

    test('Can update a key value pair', async () => {
      const key = 'key';
      const value = 'value';
      await storage.setItem(key, value);
      const storedValue = await storage.getItem(key);
      expect(storedValue).toEqual(value);
      const newValue = 'newValue';
      await storage.setItem(key, newValue);
      const newStoredValue = await storage.getItem(key);
      expect(newStoredValue).toEqual(newValue);
    });
  });

  describe('removeItem', () => {
    test('Can remove a key value pair', async () => {
      const key = 'key';
      const value = 'value';
      await storage.setItem(key, value);
      const storedValue = await storage.getItem(key);
      expect(storedValue).toEqual(value);
      await storage.removeItem(key);
      const storedValueAfterRemove = await storage.getItem(key);
      expect(storedValueAfterRemove).toBeNull();
    });
  });

  describe('getLength', () => {
    test('Can get length of present key value pairs', async () => {
      expect(await storage.getLength()).toEqual(0);
      const num = 5;
      const offset = await storage.getLength();

      for (let i = 0; i < num; i += 1) {
        await storage.setItem(i.toString(), i.toString());
        expect(await storage.getLength()).toEqual(i + 1 + offset);
      }
      await storage.removeItem('0');
      expect(await storage.getLength()).toEqual(num + offset - 1);
    });
  });

  describe('clear', () => {
    test('Can clear the storage', async () => {
      const num = 5;
      for (let i = 0; i < num; i += 1) {
        await storage.setItem(i.toString(), i.toString());
      }
      await storage.clear();
      expect(await storage.getLength()).toEqual(0);
    });
  });

  describe('key', () => {
    test('Can get keys via index', async () => {
      const num = 5;
      const offset = await storage.getLength();
      for (let i = 0; i < num; i += 1) {
        await storage.setItem(i.toString(), i.toString());
      }
      expect(await storage.getLength()).toEqual(num + offset);

      for (let i = 0; i < num; i += 1) {
        expect(await storage.key(i)).toEqual(i.toString());
      }
    });

    test('Can get null when getting keys outside of index', async () => {
      expect(await storage.key(567874)).toBeNull();
    });
  });
});
