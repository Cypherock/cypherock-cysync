import { IDerivationScheme } from '@cypherock/coin-support-interfaces';

export const CantonDerivationSchemeMap = {
  default: '',
} as const;

export type CantonDerivationSchemeName =
  (typeof CantonDerivationSchemeMap)[keyof typeof CantonDerivationSchemeMap];

export interface ICantonDerivationScheme extends IDerivationScheme {
  name: CantonDerivationSchemeName;
}
