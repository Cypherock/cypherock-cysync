import { IKeyValueStore } from '@cypherock/db-interfaces';
import { createDb } from '../src';
import { testHelper } from './__helpers__/testHelper';

describe('KeyValueStore', () => {
  test('Can initialize KeyValueStore', async () => {
    const db = createDb(':memory:');
    expect(db).toBeDefined();
    const devices = await db.device.getAll();
    expect(devices.length).toEqual(0);
    await db.destroy();
    expect(db.device.getAll()).rejects.toThrow();
  });

  let storage!: IKeyValueStore;
  beforeAll(async () => {
    await testHelper.setupTestDB();
    storage = testHelper.db.storage;
  });

  afterAll(() => {
    testHelper.teardownTestDB();
  });

  test('Can insert a key value pair', async () => {
    const key = 'key';
    const value = 'value';
    storage.setItem(key, value);
    const storedValue = storage.getItem(key);
    expect(storedValue).toEqual(value);
  });

  test('Can update a key value pair', async () => {
    const key = 'key';
    const value = 'value';
    storage.setItem(key, value);
    const storedValue = storage.getItem(key);
    expect(storedValue).toEqual(value);
    const newValue = 'newValue';
    storage.setItem(key, newValue);
    const newStoredValue = storage.getItem(key);
    expect(newStoredValue).toEqual(newValue);
  });

  test('Can remove a key value pair', async () => {
    const key = 'key';
    const value = 'value';
    storage.setItem(key, value);
    const storedValue = storage.getItem(key);
    expect(storedValue).toEqual(value);
    storage.removeItem(key);
    const storedValueAfterRemove = storage.getItem(key);
    expect(storedValueAfterRemove).toBeNull();
  });

  test('Can get length of present key value pairs', async () => {
    expect(storage.getLength()).toEqual(0);
    const key = 'key';
    const value = 'value';
    storage.setItem(key, value);
    const storedValue = storage.getItem(key);
    expect(storedValue).toEqual(value);
    expect(storage.getLength()).toEqual(1);
    const newKey = 'newKey';
    storage.setItem(newKey, value);
    const newStoredValue = storage.getItem(newKey);
    expect(newStoredValue).toEqual(value);
    expect(storage.getLength()).toEqual(2);
    storage.removeItem(key);
    const storedValueAfterRemove = storage.getItem(key);
    expect(storedValueAfterRemove).toBeNull();
    expect(storage.getLength()).toEqual(1);
  });

  test('Can clear the storage', async () => {
    const num = 5;
    const offset = storage.getLength();
    for (let i = 0; i < num; i += 1) {
      storage.setItem(i.toString(), i.toString());
    }
    expect(storage.getLength()).toEqual(num + offset);
    storage.clear();
    expect(storage.getLength()).toEqual(0);
  });

  test('Can get keys via index', async () => {
    const num = 5;
    const offset = storage.getLength();
    for (let i = 0; i < num; i += 1) {
      storage.setItem(i.toString(), i.toString());
    }
    expect(storage.getLength()).toEqual(num + offset);

    for (let i = 0; i < num; i += 1) {
      expect(storage.key(i)).toEqual(i.toString());
    }
  });

  test('Can get null when getting keys outside of index', async () => {
    expect(storage.key(567874)).toBeNull();
  });
});
