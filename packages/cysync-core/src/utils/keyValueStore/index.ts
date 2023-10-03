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
  isNewUser: createBooleanValueStore('isNewUser'),
  isTermsAccepted: createBooleanValueStore('isTermsAccepted'),
  passwordHash: createStringValueStore('passwordHash'),
  email: createStringValueStore('email'),
  onboardingCheckpointPath: createStringValueStore('onboardingCheckpointPath'),
  isAnalyticsAndBugReportEnabled: createBooleanValueStore(
    'isAnalyticsAndBugReportEnabled',
  ),
  isAutoUpdateCySyncEnabled: createBooleanValueStore(
    'isAutoUpdateCySyncEnabled',
  ),
  uuid: createStringValueStore('uuid'),
};
