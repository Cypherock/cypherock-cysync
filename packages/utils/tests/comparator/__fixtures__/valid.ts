import { type CreateComparatorValidTestCase } from './types';

export const valid: CreateComparatorValidTestCase[] = [
  {
    name: 'should return a function that returns 1 when comparing a greater string',
    input: {
      key: 'key',
      keyType: 'string',
      first: { key: 'aaaaaaa' },
      second: { key: 'aaab' },
    },
    output: 1,
  },
  {
    name: 'should return a function that returns -1 when comparing a lesser string',
    input: {
      key: 'key',
      keyType: 'string',
      first: { key: 'aaab' },
      second: { key: 'aaaaaaa' },
    },
    output: -1,
  },
  {
    name: 'should return a function that returns 1 when comparing a greater homogeneous string',
    input: {
      key: 'key',
      keyType: 'string',
      first: { key: 'aaa' },
      second: { key: 'aaaaaaa' },
    },
    output: 1,
  },
  {
    name: 'should return a function that returns 1 when comparing a lesser homogeneous string',
    input: {
      key: 'key',
      keyType: 'string',
      first: { key: 'aaaaaaa' },
      second: { key: 'aaa' },
    },
    output: -1,
  },
  {
    name: 'should return a function that returns 0 when comparing equal strings',
    input: {
      key: 'key',
      keyType: 'string',
      first: { key: 'aaaa' },
      second: { key: 'aaaa' },
    },
    output: 0,
  },
  {
    name: 'should return a function that returns 1 when first < second',
    input: {
      key: 'key',
      keyType: 'number',
      first: { key: 100 },
      second: { key: 101 },
    },
    output: 1,
  },
  {
    name: 'should return a function that returns -1 when first > second',
    input: {
      key: 'key',
      keyType: 'number',
      first: { key: 101 },
      second: { key: 100, something: 'wsdkljf' },
    },
    output: -1,
  },
  {
    name: 'should return a function that returns 0 when first = second',
    input: {
      key: 'key',
      keyType: 'number',
      first: { key: 100 },
      second: { key: 100 },
    },
    output: 0,
  },
];
