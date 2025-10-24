import { IDerivationScheme } from '@cypherock/coin-support-interfaces';

export const SiaDerivationSchemeMap = {
  default: '',
} as const;

export type SiaDerivationSchemeName =
  (typeof SiaDerivationSchemeMap)[keyof typeof SiaDerivationSchemeMap];

export interface ISiaDerivationScheme extends IDerivationScheme {
  name: SiaDerivationSchemeName;
}
