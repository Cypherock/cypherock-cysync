import { createDb } from '@cypherock/database';
import path from 'path';
import { config } from './config';
import logger from './logger';

export async function initDb() {
  const db = createDb(path.join(config.USER_DATA_PATH ?? '', 'db.sqlite'));

  db.device.setVersion(0);
  const stored = await db.device.insert({
    serial: 'tets',
    isAuthenticated: false,
    version: '123',
  });

  const allDevices = await db.device.getAll();

  logger.info({ stored, allDevices });
  await db.device.remove(stored);
}
