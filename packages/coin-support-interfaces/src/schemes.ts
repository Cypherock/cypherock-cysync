export type IDerivationPathGenerator = (
  existingDerivationPaths: string[],
  limit: number,
) => { derivationPath: string; index: number }[];

export interface IDerivationScheme {
  name: string;
  generator: IDerivationPathGenerator;
  threshold: number;
  newAccountLimit: number;
}
