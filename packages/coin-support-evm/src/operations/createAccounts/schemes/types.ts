import { IDerivationScheme } from '@cypherock/coin-support-interfaces';

export const EVMDerivationSchemeMap = {
  ledger: 'ledger',
  metamask: 'metamask',
  legacy: 'legacy',
} as const;

export type EVMDerivationSchemeName =
  (typeof EVMDerivationSchemeMap)[keyof typeof EVMDerivationSchemeMap];

export interface IEVMDerivationScheme extends IDerivationScheme {
  name: EVMDerivationSchemeName;
}
