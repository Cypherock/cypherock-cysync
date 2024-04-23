import {
  ICreateAccountParams,
  IDerivationPathGenerator,
  IDerivationScheme,
} from '@cypherock/coin-support-interfaces';
import { IAccount } from '@cypherock/db-interfaces';

export const createDerivationPathGenerator =
  (basePath: string): IDerivationPathGenerator =>
  (existingDerivationPaths, limit) => {
    const derivationPaths: { derivationPath: string; index: number }[] = [];

    let startIndex = 0;

    while (derivationPaths.length < limit) {
      const nextDerivationPath = basePath.replace('i', startIndex.toString());

      // Skip if an account already exists with the same derivationPath
      if (!existingDerivationPaths.includes(nextDerivationPath)) {
        derivationPaths.push({
          derivationPath: nextDerivationPath,
          index: startIndex,
        });
      }

      if (!basePath.includes('i')) break;

      startIndex += 1;
    }

    return derivationPaths;
  };

export interface IGenerateDerivationPathsPerSchemeParams
  extends ICreateAccountParams {
  derivationPathSchemes: Record<string, IDerivationScheme | undefined>;
  limit: number;
  existingAccounts: IAccount[];
}

export const generateDerivationPathsPerScheme = async (
  params: IGenerateDerivationPathsPerSchemeParams,
) => {
  const { derivationPathSchemes, limit, existingAccounts } = params;

  const existingDerivationPaths = existingAccounts.map(e => e.derivationPath);

  const derivationSchemeNames = Object.keys(derivationPathSchemes).filter(
    n => !!derivationPathSchemes[n],
  );
  const pathLimitPerDerivationScheme = Math.floor(
    limit / derivationSchemeNames.length,
  );

  const derivedPathsPerScheme: Record<
    string,
    { derivationPath: string; index: number }[]
  > = {};
  const derivedPaths: string[] = [];

  for (const schemeName of derivationSchemeNames) {
    const derivationPathSchemeDetails = derivationPathSchemes[schemeName];
    if (!derivationPathSchemeDetails) continue;

    const paths = derivationPathSchemeDetails.generator(
      // This is done because there can be overlapping derivation paths
      // between different schemes
      [...existingDerivationPaths, ...derivedPaths],
      pathLimitPerDerivationScheme,
    );
    derivedPathsPerScheme[schemeName] = paths;
    derivedPaths.push(...paths.map(p => p.derivationPath));
  }

  return derivedPathsPerScheme;
};
