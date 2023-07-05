import fs from 'fs/promises';
import os from 'os';
import path from 'path';

const PRODUCT_NAME = 'Electron';
const osPathMap = {
  darwin: ['Library', 'Application Support'],
  win32: ['AppData', 'Roaming'],
  linux: ['.config'],
};

const getCysyncUserDataPath = () => {
  const osPath = osPathMap[process.platform];
  if (!osPath) return '';
  return path.join(os.homedir(), ...osPath, PRODUCT_NAME);
};

type WhichDatabase = 'Db' | 'KeyDb';
const dbFolderMap: Record<WhichDatabase, string> = {
  Db: 'data.db',
  KeyDb: 'storage.db',
};
export const removeCysyncDatabase = async (whichDatabase?: WhichDatabase) => {
  const basePath = getCysyncUserDataPath();
  if (!basePath) return;
  const databasePath = path.join(
    getCysyncUserDataPath(),
    'cysync-data',
    dbFolderMap[whichDatabase ?? ''],
  );
  await fs.rm(databasePath, { recursive: true, force: true });
};
