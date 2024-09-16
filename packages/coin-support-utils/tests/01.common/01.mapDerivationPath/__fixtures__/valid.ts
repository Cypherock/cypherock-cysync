import { MapDerivationPathTestCases } from './types';

export const valid: MapDerivationPathTestCases[] = [
  {
    name: 'should map derivation path with single index',
    input: "m/44'",
    output: [0x80000000 + 44],
  },
  {
    name: 'should map derivation path with multiple index',
    input: "m/44'/0'/0'/0/0",
    output: [2147483692, 2147483648, 2147483648, 0, 0],
  },
  {
    name: 'should map derivation path with multiple index without m prefix',
    input: "44'/0'/0'/0/0",
    output: [2147483692, 2147483648, 2147483648, 0, 0],
  },
];
