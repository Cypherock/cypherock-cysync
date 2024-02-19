import { IDerivationScheme } from '@cypherock/coin-support-interfaces';

export const StarknetDerivationSchemeMap = {
  default: 'default',
} as const;

export type StarknetDerivationSchemeName =
  (typeof StarknetDerivationSchemeMap)[keyof typeof StarknetDerivationSchemeMap];

export interface IStarknetDerivationScheme extends IDerivationScheme {
  name: StarknetDerivationSchemeName;
}
