import { getCoinSupportXrpLib } from './xrpLib';

export const deriveAddress = (publicKey: string) =>
  getCoinSupportXrpLib().deriveAddress(publicKey);
