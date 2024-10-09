import { IDerivationScheme } from '@cypherock/coin-support-interfaces';

export const XrpDerivationSchemeMap = {
  default: 'default',
} as const;

export type XrpDerivationSchemeName =
  (typeof XrpDerivationSchemeMap)[keyof typeof XrpDerivationSchemeMap];

export interface IXrpDerivationScheme extends IDerivationScheme {
  name: XrpDerivationSchemeName;
}
