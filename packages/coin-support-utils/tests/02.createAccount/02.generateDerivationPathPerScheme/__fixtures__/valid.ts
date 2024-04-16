import { createDerivationPathGenerator } from '../../../../src/createAccount';
import { accounts } from '../../../__fixtures__';
import { DerivationPathPerSchemeGeneratorTestCases } from './types';

export const valid: DerivationPathPerSchemeGeneratorTestCases[] = [
  {
    name: 'should generate derivation paths from index zero',
    input: {
      derivationPathSchemes: {
        legacy: {
          threshold: 2,
          newAccountLimit: 0, // this is getting ignored
          name: 'legacy',
          generator: createDerivationPathGenerator("m/44'/0'/0'/0/i"),
        },
      },
      limit: 4,
      existingAccounts: [],
    },
    output: {
      legacy: [
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
        {
          derivationPath: "m/44'/0'/0'/0/3",
          index: 3,
        },
      ],
    },
  },
  {
    name: 'should ignore undefined derivation path scheme',
    input: {
      derivationPathSchemes: {
        legacy: undefined,
      },
      limit: 4,
      existingAccounts: [],
    },
    output: {},
  },
  {
    name: 'should generate derivation paths from index zero with multiple schemes',
    input: {
      derivationPathSchemes: {
        legacy: {
          name: 'legacy',
          generator: createDerivationPathGenerator("m/44'/0'/i'"),
          threshold: 2,
          newAccountLimit: 0, // this is getting ignored
        },
        segwit: {
          name: 'segwit',
          generator: createDerivationPathGenerator(`m/49'/0'/i'`),
          threshold: 2,
          newAccountLimit: 0, // this is getting ignored
        },
      },
      limit: 4,
      existingAccounts: [],
    },
    output: {
      legacy: [
        {
          derivationPath: "m/44'/0'/0'",
          index: 0,
        },
        {
          derivationPath: "m/44'/0'/1'",
          index: 1,
        },
      ],
      segwit: [
        {
          derivationPath: "m/49'/0'/0'",
          index: 0,
        },
        {
          derivationPath: "m/49'/0'/1'",
          index: 1,
        },
      ],
    },
  },
  {
    name: 'should generate derivation paths from index zero with multiple schemes ignoring existing accounts',
    input: {
      derivationPathSchemes: {
        legacy: {
          name: 'legacy',
          generator: createDerivationPathGenerator("m/44'/0'/i'"),
          threshold: 2,
          newAccountLimit: 0, // this is getting ignored
        },
        segwit: {
          name: 'segwit',
          generator: createDerivationPathGenerator(`m/49'/0'/i'`),
          threshold: 2,
          newAccountLimit: 0, // this is getting ignored
        },
        somethingRandom: undefined,
      },
      limit: 4,
      existingAccounts: accounts,
    },
    output: {
      legacy: [
        {
          derivationPath: "m/44'/0'/1'",
          index: 1,
        },
        {
          derivationPath: "m/44'/0'/2'",
          index: 2,
        },
      ],
      segwit: [
        {
          derivationPath: "m/49'/0'/0'",
          index: 0,
        },
        {
          derivationPath: "m/49'/0'/1'",
          index: 1,
        },
      ],
    },
  },
];
