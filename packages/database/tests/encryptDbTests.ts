import { DatabaseError, DatabaseErrorType } from '@cypherock/db-interfaces';

import { EncryptedDB } from '../src/encryptedDb'; // Adjust the import based on your directory structure

describe('EncryptedDB', () => {
  const dbPath = 'test.db';
  let db: EncryptedDB;

  afterEach(async () => {
    if (db) {
      await db.close();
    }
  });

  test('can get the database instance', async () => {
    db = await EncryptedDB.create(dbPath);
    await db.load();
    expect(db.getDB()).resolves.toBeDefined();
  });

  test('can unload a database', async () => {
    db = await EncryptedDB.create(dbPath);
    await db.load();
    await db.unload();
    expect(db.isLoaded()).toBeFalsy();
  });

  test('throws error if getDB is called on a closed database', async () => {
    db = await EncryptedDB.create(dbPath);
    await db.load();
    await db.close();
    await expect(db.getDB()).rejects.toThrow(
      new DatabaseError(DatabaseErrorType.DATABASE_CLOSED),
    );
  });

  test('throws error if getDB is called on an unloaded database', async () => {
    db = await EncryptedDB.create(dbPath);
    await expect(db.getDB()).rejects.toThrow(
      new DatabaseError(DatabaseErrorType.DATABASE_NOT_LOADED),
    );
  });

  test('can handle change', async () => {
    db = await EncryptedDB.create(dbPath);
    await db.load();
    const throttledHandleChangeMock = jest.fn();
    (db as any).throttledHandleChange = throttledHandleChangeMock;
    await db.onChange();
    expect(throttledHandleChangeMock).toHaveBeenCalled();
  });

  test('can clear the database', async () => {
    db = await EncryptedDB.create(dbPath);
    await db.load();
    await db.clear();
    expect(db.isLoaded()).toBeFalsy();
  });

  test('getPath returns the correct database path', async () => {
    db = await EncryptedDB.create(dbPath);
    expect(db.getPath()).toBe(dbPath);
  });

  test('can change encryption key', async () => {
    db = await EncryptedDB.create(dbPath);
    await db.load();
    const saveDBMock = jest
      .spyOn(db as any, 'saveDB')
      .mockResolvedValueOnce(undefined);
    const updateKeyMock = jest.spyOn(db as any, 'updateKey');

    const newKey = 'new-encryption-key';
    await db.changeEncryptionKey(newKey);

    expect(updateKeyMock).toHaveBeenCalledWith(newKey);
    expect(saveDBMock).toHaveBeenCalled();
  });
});
