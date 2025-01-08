import { IDerivationScheme } from '@cypherock/coin-support-interfaces';

export const StarknetDerivationSchemeMap = {
  ledger: '',
} as const;

export type StarknetDerivationSchemeName =
  (typeof StarknetDerivationSchemeMap)[keyof typeof StarknetDerivationSchemeMap];

export interface IStarknetDerivationScheme extends IDerivationScheme {
  name: StarknetDerivationSchemeName;
}
