import { IDerivationScheme } from '@cypherock/coin-support-interfaces';

export const TronDerivationSchemeMap = {
  tronlink: 'tronlink',
  atomic: 'atomic',
} as const;

export type TronDerivationSchemeName =
  (typeof TronDerivationSchemeMap)[keyof typeof TronDerivationSchemeMap];

export interface ITronDerivationScheme extends IDerivationScheme {
  name: TronDerivationSchemeName;
}
