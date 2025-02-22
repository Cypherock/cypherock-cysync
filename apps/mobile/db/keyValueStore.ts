import { KeyValueStore } from './logic/store';

export const keyDb = new KeyValueStore();

const createBooleanValueStore = (key: string) => ({
  get: async () => (await keyDb.getItem(key)) === 'true',
  set: async (val: boolean) => keyDb.setItem(key, val.toString()),
  remove: async () => keyDb.removeItem(key),
});

const createStringValueStore = (key: string) => ({
  get: async () => keyDb.getItem(key),
  set: async (val: string) => keyDb.setItem(key, val),
  remove: async () => keyDb.removeItem(key),
});

export const keyValueStore = {
  isOnboardingCompleted: createBooleanValueStore('isOnboardingCompleted'),
  isTermsAccepted: createBooleanValueStore('isTermsAccepted'),
  passwordHash: createStringValueStore('passwordHash'),
  appLanguage: createStringValueStore('appLanguage'),
};
