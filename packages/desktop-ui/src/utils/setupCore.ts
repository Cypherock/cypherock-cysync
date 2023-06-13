import { setDB, setKeyDB, updateLogger } from '@cypherock/cysync-core';
import { createServiceLogger } from './logger';

export const setupCoreDependencies = async () => {
  updateLogger(createServiceLogger);
  setDB(await window.electronAPI.getDb());
  setKeyDB(await window.electronAPI.getKeyDb());
};
