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

export const removeCysyncDatabase = async () => {
  const basePath = getCysyncUserDataPath();
  if (!basePath) return;
  const databasePath = path.join(getCysyncUserDataPath(), 'cysync-data');
  await fs.rm(databasePath, { recursive: true, force: true });
};
