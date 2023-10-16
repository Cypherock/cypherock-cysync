import * as uuid from 'uuid';

import { keyValueStore } from './keyValueStore';

export const getUUID = async (): Promise<string> => {
  let id = await keyValueStore.uuid.get();
  if (id === null) {
    id = uuid.v4();
    await keyValueStore.uuid.set(id);
  }
  return id;
};
