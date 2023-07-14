import { IDerivationScheme } from '@cypherock/coin-support-interfaces';

export const EvmDerivationSchemeMap = {
  ledger: 'ledger',
  metamask: 'metamask',
  legacy: 'legacy',
} as const;

export type EvmDerivationSchemeName =
  (typeof EvmDerivationSchemeMap)[keyof typeof EvmDerivationSchemeMap];

export interface IEvmDerivationScheme extends IDerivationScheme {
  name: EvmDerivationSchemeName;
}
