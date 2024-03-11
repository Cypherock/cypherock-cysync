import { describe, expect, test } from '@jest/globals';

import { isSubset } from '../src';

describe('isSubset', () => {
  test('should export isSubset function', () => {
    expect(isSubset).toBeDefined();
  });

  describe('should return true on valid subsets', () => {
    const testCases = [
      {
        subset: {},
        superSet: {},
      },
      {
        subset: {},
        superSet: { a: 1 },
      },
      {
        subset: { a: 1 },
        superSet: { a: 1, b: 2 },
      },
      {
        subset: { a: { a: 1 } },
        superSet: { a: { a: 1 } },
      },
      {
        subset: { a: { a: 1 } },
        superSet: { a: { a: 1, b: 1 } },
      },
    ];

    testCases.forEach(testCase => {
      const subset = JSON.stringify(testCase.subset);
      const superSet = JSON.stringify(testCase.superSet);
      test(`subset: ${subset}, superSet: ${superSet}`, () => {
        expect(isSubset(testCase.subset, testCase.superSet)).toBe(true);
      });
    });
  });

  describe('should return false on invalid subsets', () => {
    const testCases = [
      {
        subset: { a: 1 },
        superSet: {},
      },
      {
        subset: { a: 1, b: 2 },
        superSet: { a: 1 },
      },
      {
        subset: { a: { a: 1 } },
        superSet: { a: { b: 1 } },
      },
      {
        subset: { a: { a: 1, b: 1 } },
        superSet: { a: { a: 1 } },
      },
    ];
    testCases.forEach(testCase => {
      const subset = JSON.stringify(testCase.subset);
      const superSet = JSON.stringify(testCase.superSet);
      test(`subset: ${subset}, superSet: ${superSet}`, () => {
        expect(isSubset(testCase.subset, testCase.superSet)).toBe(false);
      });
    });
  });
});
