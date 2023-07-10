import { ICysyncEnv } from '@cypherock/cysync-interfaces';

declare global {
  interface Window {
    cysyncEnv: ICysyncEnv;
  }
}
