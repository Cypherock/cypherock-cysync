import { mapDerivationPath } from '../../../../src';
import { derivationPathAddressMap } from './derivationPathAddressMap';
import { AddressesPerSchemeGeneratorTestCases } from './types';

export const valid: AddressesPerSchemeGeneratorTestCases[] = [
  {
    name: 'should generate addresses with one scheme, derivation path and one index',
    input: {
      derivationPathsPerScheme: {
        legacy: [
          {
            derivationPath: "m/44'/0'/0'/0/0",
            index: 0,
          },
        ],
      },
    },
    output: {
      legacy: [
        {
          address: derivationPathAddressMap.get(
            mapDerivationPath("m/44'/0'/0'/0/0"),
          )!,
          derivationPath: "m/44'/0'/0'/0/0",
          index: 0,
        },
      ],
    },
  },
  {
    name: 'should generate addresses per scheme with one derivation path and one index',
    input: {
      derivationPathsPerScheme: {
        legacy: [
          {
            derivationPath: "m/44'/0'/0'/0/0",
            index: 0,
          },
        ],
        nativeSegwit: [
          {
            derivationPath: "m/84'/0'/0'/0/0",
            index: 0,
          },
        ],
        segwit: [
          {
            derivationPath: "m/49'/0'/0'/0/0",
            index: 0,
          },
        ],
      },
    },
    output: {
      legacy: [
        {
          address: derivationPathAddressMap.get(
            mapDerivationPath("m/44'/0'/0'/0/0"),
          )!,
          derivationPath: "m/44'/0'/0'/0/0",
          index: 0,
        },
      ],
      nativeSegwit: [
        {
          address: derivationPathAddressMap.get(
            mapDerivationPath("m/84'/0'/0'/0/0"),
          )!,
          derivationPath: "m/84'/0'/0'/0/0",
          index: 0,
        },
      ],
      segwit: [
        {
          address: derivationPathAddressMap.get(
            mapDerivationPath("m/49'/0'/0'/0/0"),
          )!,
          derivationPath: "m/49'/0'/0'/0/0",
          index: 0,
        },
      ],
    },
  },
  {
    name: 'should generate addresses per scheme with multiple derivation paths and indexes',
    input: {
      derivationPathsPerScheme: {
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
        ],
        nativeSegwit: [
          {
            derivationPath: "m/84'/0'/0'/0/0",
            index: 0,
          },
          {
            derivationPath: "m/84'/0'/0'/0/1",
            index: 1,
          },
          {
            derivationPath: "m/84'/0'/0'/0/2",
            index: 2,
          },
        ],
        segwit: [
          {
            derivationPath: "m/49'/0'/0'/0/0",
            index: 0,
          },
          {
            derivationPath: "m/49'/0'/0'/0/1",
            index: 1,
          },
          {
            derivationPath: "m/49'/0'/0'/0/2",
            index: 2,
          },
        ],
      },
    },
    output: {
      legacy: [
        {
          address: derivationPathAddressMap.get(
            mapDerivationPath("m/44'/0'/0'/0/0"),
          )!,
          derivationPath: "m/44'/0'/0'/0/0",
          index: 0,
        },
        {
          address: derivationPathAddressMap.get(
            mapDerivationPath("m/44'/0'/0'/0/1"),
          )!,
          derivationPath: "m/44'/0'/0'/0/1",
          index: 1,
        },
        {
          address: derivationPathAddressMap.get(
            mapDerivationPath("m/44'/0'/0'/0/2"),
          )!,
          derivationPath: "m/44'/0'/0'/0/2",
          index: 2,
        },
      ],
      nativeSegwit: [
        {
          address: derivationPathAddressMap.get(
            mapDerivationPath("m/84'/0'/0'/0/0"),
          )!,
          derivationPath: "m/84'/0'/0'/0/0",
          index: 0,
        },
        {
          address: derivationPathAddressMap.get(
            mapDerivationPath("m/84'/0'/0'/0/1"),
          )!,
          derivationPath: "m/84'/0'/0'/0/1",
          index: 1,
        },
        {
          address: derivationPathAddressMap.get(
            mapDerivationPath("m/84'/0'/0'/0/2"),
          )!,
          derivationPath: "m/84'/0'/0'/0/2",
          index: 2,
        },
      ],
      segwit: [
        {
          address: derivationPathAddressMap.get(
            mapDerivationPath("m/49'/0'/0'/0/0"),
          )!,
          derivationPath: "m/49'/0'/0'/0/0",
          index: 0,
        },
        {
          address: derivationPathAddressMap.get(
            mapDerivationPath("m/49'/0'/0'/0/1"),
          )!,
          derivationPath: "m/49'/0'/0'/0/1",
          index: 1,
        },
        {
          address: derivationPathAddressMap.get(
            mapDerivationPath("m/49'/0'/0'/0/2"),
          )!,
          derivationPath: "m/49'/0'/0'/0/2",
          index: 2,
        },
      ],
    },
  },
];
