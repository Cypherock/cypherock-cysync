import { DerivationPathGeneratorTestCases } from './types';

export const valid: DerivationPathGeneratorTestCases[] = [
  {
    name: 'should generate derivation path from zero index',
    input: {
      basePath: "m/44'/0'/0'/0/i",
      existingDerivationPaths: [],
      limit: 3,
    },
    output: [
      {
        derivationPath: "m/44'/0'/0'/0/0",
        index: 0,
      },
      {
        derivationPath: "m/44'/0'/0'/0/1",
        index: 1,
      },
      {
        derivationPath: "m/44'/0'/0'/0/2",
        index: 2,
      },
    ],
  },
  {
    name: 'should generate derivation path excluding existing derivation path',
    input: {
      basePath: "m/44'/0'/0'/0/i",
      existingDerivationPaths: ["m/44'/0'/0'/0/1"],
      limit: 2,
    },
    output: [
      {
        derivationPath: "m/44'/0'/0'/0/0",
        index: 0,
      },
      {
        derivationPath: "m/44'/0'/0'/0/2",
        index: 2,
      },
    ],
  },
  {
    name: 'should return empty array if basePath does not include i',
    input: {
      basePath: "m/44'/0'/0'/0/0",
      existingDerivationPaths: [],
      limit: 2,
    },
    output: [],
  },
];
