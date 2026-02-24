import { ICantonAuthTokens } from '@/store/canton';
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

const createObjectValueStore = <T extends object>(key: string) => ({
  get: async () => JSON.parse((await keyDb.getItem(key)) ?? '{}') as T,
  set: async (val: T) => keyDb.setItem(key, JSON.stringify(val)),
  remove: async () => keyDb.removeItem(key),
});

export const keyValueStore = {
  isOnboardingCompleted: createBooleanValueStore('isOnboardingCompleted'),
  isTermsAccepted: createBooleanValueStore('isTermsAccepted'),
  passwordHash: createStringValueStore('passwordHash'),
  appLanguage: createStringValueStore('appLanguage'),
  preferredCurrency: createStringValueStore('preferredCurrency'),
  cantonAuthTokens:
    createObjectValueStore<ICantonAuthTokens>('cantonAuthTokens'),
};
