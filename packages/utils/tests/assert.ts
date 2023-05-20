import { describe, expect, test } from '@jest/globals';
import { assert } from '../src';

describe('assert', () => {
  describe('should throw error when assertion fails', () => {
    const testCases = [
      {
        name: 'undefined',
        condition: undefined,
        error: 'Invalid argument',
        errorMessage: 'AssertionError: Invalid argument',
      },
      {
        name: 'null',
        condition: null,
        error: 'Invalid argument',
        errorMessage: 'AssertionError: Invalid argument',
      },
      {
        name: 'false',
        condition: false,
        error: 'Invalid argument',
        errorMessage: 'AssertionError: Invalid argument',
      },
      {
        name: 'false',
        condition: false,
        error: new Error('Custom error'),
        errorMessage: 'Custom error',
      },
    ];

    testCases.forEach(testCase => {
      test(testCase.name, () => {
        expect(() => assert(testCase.condition, testCase.error)).toThrowError(
          testCase.errorMessage,
        );
      });
    });
  });

  describe('should not throw error assertion is satisfied', () => {
    const testCases = [
      {
        name: 'string',
        condition: 'aksjdh',
      },
      {
        name: 'empty string',
        condition: '',
      },
      {
        name: 'object',
        condition: {},
      },
      {
        name: 'array',
        condition: [],
      },
      {
        name: 'number',
        condition: 1,
      },
      {
        name: 'number zero',
        condition: 0,
      },
      {
        name: 'negative number',
        condition: -12,
      },
    ];

    testCases.forEach(testCase => {
      test(testCase.name, () => {
        expect(() =>
          assert(testCase.condition, 'Should not have failed'),
        ).not.toThrow();
      });
    });
  });
});
