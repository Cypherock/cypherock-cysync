import { describe, expect, test } from '@jest/globals';
import { isSubset } from '../../src';
import { fixtures } from './__fixtures__';

describe('isSubset', () => {
  test('should export isSubset function', () => {
    expect(isSubset).toBeDefined();
  });

  describe('should return true on valid subsets', () => {
    fixtures.valid.forEach(testCase => {
      const subset = JSON.stringify(testCase.subset);
      const superSet = JSON.stringify(testCase.superSet);
      test(`subset: ${subset}, superSet: ${superSet}`, () => {
        expect(isSubset(testCase.subset, testCase.superSet)).toBe(true);
      });
    });
  });

  describe('should return false on invalid subsets', () => {
    fixtures.invalid.forEach(testCase => {
      const subset = JSON.stringify(testCase.subset);
      const superSet = JSON.stringify(testCase.superSet);
      test(`subset: ${subset}, superSet: ${superSet}`, () => {
        expect(isSubset(testCase.subset, testCase.superSet)).toBe(false);
      });
    });
  });
});
