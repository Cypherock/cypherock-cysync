import { describe, expect, test } from '@jest/globals';
import { assert } from '../../src';
import { fixture } from './__fixtures__';

describe('assert', () => {
  describe('should throw error when assertion fails', () => {
    fixture.invalid.forEach(testCase => {
      test(testCase.name, () => {
        expect(() => assert(testCase.condition, testCase.error)).toThrowError(
          testCase.errorMessage,
        );
      });
    });
  });

  describe('should not throw error assertion is satisfied', () => {
    fixture.valid.forEach(testCase => {
      test(testCase.name, () => {
        expect(() =>
          assert(testCase.condition, 'Should not have failed'),
        ).not.toThrow();
      });
    });
  });
});
