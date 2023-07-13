import { IDerivationScheme } from '@cypherock/coin-support-interfaces';

export const BTCDerivationSchemeMap = {
  nativeSegwit: 'nativeSegwit',
  segwit: 'segwit',
  legacy: 'legacy',
  taproot: 'taproot',
} as const;

export type BTCDerivationSchemeName =
  (typeof BTCDerivationSchemeMap)[keyof typeof BTCDerivationSchemeMap];

export interface IBTCDerivationScheme extends IDerivationScheme {
  name: BTCDerivationSchemeName;
}
