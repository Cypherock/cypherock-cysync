export type IDerivationPathGenerator = (
  existingDerivationPaths: string[],
  limit: number,
) => string[];

export interface IDerivationScheme {
  name: string;
  generator: IDerivationPathGenerator;
  threshold: number;
}
