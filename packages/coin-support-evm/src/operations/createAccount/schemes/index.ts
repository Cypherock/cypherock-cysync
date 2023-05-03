import {
  DerivationSchemeName,
  IDerivationPathGenerator,
  IDerivationScheme,
} from './types';

const createDerivationPathGenerator =
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

export const derivationPathSchemes: Record<
  DerivationSchemeName,
  IDerivationScheme
> = {
  ledger: {
    name: 'ledger',
    generator: createDerivationPathGenerator("m/44'/60'/i'/0/0"),
  },
  metamask: {
    name: 'metamask',
    generator: createDerivationPathGenerator("m/44'/60'/0'/0/i"),
  },
  legacy: {
    name: 'legacy',
    generator: createDerivationPathGenerator("m/44'/60'/0'/i"),
  },
};
