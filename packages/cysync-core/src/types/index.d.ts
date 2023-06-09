import { ICysyncEnv } from '@cypherock/cysync-interfaces';

declare module '*.jpg';
declare module '*.png';
declare module '*.svg';

declare global {
  interface Window {
    cysyncEnv: ICysyncEnv;
  }
}
