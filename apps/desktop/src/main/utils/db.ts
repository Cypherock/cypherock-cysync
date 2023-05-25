import { createDb } from '@cypherock/database';
import path from 'path';
import { config } from './config';
import { logger } from './logger';

export async function initDb() {
  const db = createDb(path.join(config.USER_DATA_PATH, 'cysync-data/'));

  db.device.setVersion(0);
  const stored = await db.device.insert({
    serial: 'tets',
    isAuthenticated: false,
    version: '123',
  });

  const allDevices = await db.device.getAll();

  logger.debug({ stored, allDevices });
  await db.device.remove(stored);

  await db.storage.setItem('random', 'item');
  const item = await db.storage.getItem('random');
  const count = await db.storage.getLength();

  logger.debug({ item, count });

  await db.storage.clear();
}
