import { IDerivationScheme } from '@cypherock/coin-support-interfaces';

export const SolanaDerivationSchemeMap = {
  paper: 'paper',
  ledger: 'ledger',
  phantom: 'phantom',
} as const;

export type SolanaDerivationSchemeName =
  (typeof SolanaDerivationSchemeMap)[keyof typeof SolanaDerivationSchemeMap];

export interface ISolanaDerivationScheme extends IDerivationScheme {
  name: SolanaDerivationSchemeName;
}
