import fs from 'fs';

import { DatabaseError, DatabaseErrorType } from '@cypherock/db-interfaces';

import { EncryptedDB } from '../encryptedDb';

describe('EncryptedDB', () => {
  const dbPath = 'test.db';
  let db: EncryptedDB;

  afterEach(async () => {
    if (db) {
      await db.close();
    }
  });

  afterAll(async () => {
    if (fs.existsSync(dbPath)) {
      fs.unlinkSync(dbPath);
    }
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

  test('getPath returns the correct database path', async () => {
    db = await EncryptedDB.create(dbPath);
    expect(db.getPath()).toBe(dbPath);
  });
});
