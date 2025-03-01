import { IDerivationScheme } from '@cypherock/coin-support-interfaces';

export const IcpDerivationSchemeMap = {
  default: '',
} as const;

export type IcpDerivationSchemeName =
  (typeof IcpDerivationSchemeMap)[keyof typeof IcpDerivationSchemeMap];

export interface IIcpDerivationScheme extends IDerivationScheme {
  name: IcpDerivationSchemeName;
}
