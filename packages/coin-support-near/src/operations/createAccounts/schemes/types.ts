import { IDerivationScheme } from '@cypherock/coin-support-interfaces';

export const NearDerivationSchemeMap = {
  default: 'default',
} as const;

export type NearDerivationSchemeName =
  (typeof NearDerivationSchemeMap)[keyof typeof NearDerivationSchemeMap];

export interface INearDerivationScheme extends IDerivationScheme {
  name: NearDerivationSchemeName;
}
