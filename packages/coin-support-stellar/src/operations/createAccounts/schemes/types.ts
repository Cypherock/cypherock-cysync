import { IDerivationScheme } from '@cypherock/coin-support-interfaces';

export const StellarDerivationSchemeMap = {
  default: '',
} as const;

export type StellarDerivationSchemeName =
  (typeof StellarDerivationSchemeMap)[keyof typeof StellarDerivationSchemeMap];

export interface IStellarDerivationScheme extends IDerivationScheme {
  name: StellarDerivationSchemeName;
}
