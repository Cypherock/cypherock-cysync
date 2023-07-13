import {
  ICreateAccountParams,
  IDerivationPathGenerator,
  IDerivationScheme,
} from '@cypherock/coin-support-interfaces';

export const createDerivationPathGenerator =
  (basePath: string): IDerivationPathGenerator =>
  (existingDerivationPaths, limit) => {
    const derivationPaths: string[] = [];

    let startIndex = 0;

    while (derivationPaths.length < limit) {
      const nextDerivationPath = basePath.replace('i', startIndex.toString());

      // Skip if an account already exists with the same derivationPath
      if (!existingDerivationPaths.includes(nextDerivationPath)) {
        derivationPaths.push(nextDerivationPath);
      }

      startIndex += 1;
    }

    return derivationPaths;
  };

export interface IGenerateDerivationPathsPerSchemeParams
  extends ICreateAccountParams {
  derivationPathSchemes: Record<string, IDerivationScheme>;
  limit: number;
}

export const generateDerivationPathsPerScheme = async (
  params: IGenerateDerivationPathsPerSchemeParams,
) => {
  const { db, walletId, derivationPathSchemes, limit } = params;

  const accounts = await db.account.getAll({ walletId });
  const existingDerivationPaths = accounts.map(e => e.derivationPath);

  const derivationSchemeNames = Object.keys(derivationPathSchemes);
  const pathLimitPerDerivationScheme = Math.floor(
    limit / derivationSchemeNames.length,
  );

  const derivedPathsPerScheme: Record<string, string[]> = {};
  const derivedPaths: string[] = [];

  for (const schemeName of derivationSchemeNames) {
    const paths = derivationPathSchemes[schemeName].generator(
      // This is done because there can be overlapping derivation paths
      // between different schemes
      [...existingDerivationPaths, ...derivedPaths],
      pathLimitPerDerivationScheme,
    );
    derivedPathsPerScheme[schemeName] = paths;
    derivedPaths.push(...paths);
  }

  return derivedPathsPerScheme;
};
