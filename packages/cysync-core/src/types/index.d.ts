import { ICysyncEnv, ICysyncFeatureFlags } from '@cypherock/cysync-interfaces';

declare global {
  interface Window {
    cysyncEnv: ICysyncEnv;
    cysyncFeatureFlags: ICysyncFeatureFlags;
  }
}
