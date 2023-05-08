export type IDerivationPathGenerator = (
  existingDerivationPaths: string[],
  limit: number,
) => string[];

export const DerivationSchemeMap = {
  ledger: 'ledger',
  metamask: 'metamask',
  legacy: 'legacy',
} as const;

export type DerivationSchemeName =
  (typeof DerivationSchemeMap)[keyof typeof DerivationSchemeMap];

export interface IDerivationScheme {
  name: DerivationSchemeName;
  generator: IDerivationPathGenerator;
  threshold: number;
}
