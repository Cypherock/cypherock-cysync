import { getKeyDB } from '../db';

const createBooleanValueStore = (key: string) => ({
  get: async () => (await getKeyDB().getItem(key)) === 'true',
  set: async (val: boolean) => getKeyDB().setItem(key, val.toString()),
  remove: async () => getKeyDB().removeItem(key),
});

const createStringValueStore = (key: string) => ({
  get: async () => getKeyDB().getItem(key),
  set: async (val: string) => getKeyDB().setItem(key, val),
  remove: async () => getKeyDB().removeItem(key),
});

export const keyValueStore = {
  isOnboardingCompleted: createBooleanValueStore('isOnboardingCompleted'),
  isLinuxPermissionSetupDone: createBooleanValueStore(
    'isLinuxPermissionSetupDone',
  ),
  passwordHash: createStringValueStore('passwordHash'),
};
