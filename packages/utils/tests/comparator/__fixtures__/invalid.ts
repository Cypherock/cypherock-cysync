import { type CreateComparatorInvalidTestCase } from './types';

export const invalid: CreateComparatorInvalidTestCase[] = [
  {
    name: 'should throw error when key is not present in objects',
    input: {
      key: 'nonExistentKey',
      keyType: 'string',
      first: { key: 'aaaaaaa' },
      second: { key: 'aaab' },
    },
    errorMessage: "Key 'nonExistentKey' not found in objects",
  },
  {
    name: 'should throw error when first object is undefined',
    input: {
      key: 'key',
      keyType: 'string',
      first: undefined,
      second: { key: 'aaab' },
    },
    errorMessage: 'undefined is not allowed in comparator parameters',
  },
  {
    name: 'should throw error when first object is null',
    input: {
      key: 'key',
      keyType: 'string',
      first: null,
      second: { key: 'aaab' },
    },
    errorMessage: 'null is not allowed in comparator parameters',
  },
  {
    name: 'should throw error when first object is set',
    input: {
      key: 'key',
      keyType: 'string',
      first: new Set(),
      second: { key: 'aaab' },
    },
    errorMessage: 'set is not allowed in comparator parameters',
  },
  {
    name: 'should throw error when first object is array',
    input: {
      key: 'key',
      keyType: 'string',
      first: [1, 2, 3],
      second: { key: 'aaab' },
    },
    errorMessage: 'array is not allowed in comparator parameters',
  },

  {
    name: 'should throw error when second object is undefined',
    input: {
      key: 'key',
      keyType: 'string',
      first: { key: 'aaab' },
      second: undefined,
    },
    errorMessage: 'undefined is not allowed in comparator parameters',
  },
  {
    name: 'should throw error when second object is null',
    input: {
      key: 'key',
      keyType: 'string',
      first: { key: 'aaab' },
      second: null,
    },
    errorMessage: 'null is not allowed in comparator parameters',
  },
  {
    name: 'should throw error when second object is set',
    input: {
      key: 'key',
      keyType: 'string',
      first: { key: 'aaab' },
      second: new Set(),
    },
    errorMessage: 'set is not allowed in comparator parameters',
  },
  {
    name: 'should throw error when second object is array',
    input: {
      key: 'key',
      keyType: 'string',
      first: { key: 'aaab' },
      second: [1, 2, 3],
    },
    errorMessage: 'array is not allowed in comparator parameters',
  },
];
