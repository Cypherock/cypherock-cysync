import { describe, expect, test } from '@jest/globals';
import { objectToCloneableObject } from '../../src';
import { fixtures } from './__fixtures__';

describe('objectToCloneableObject', () => {
  test('should export objectToCloneableObject function', () => {
    expect(objectToCloneableObject).toBeDefined();
  });

  describe('should return the defined result', () => {
    fixtures.valid.forEach(testCase => {
      test(testCase.name, () => {
        expect(objectToCloneableObject(testCase.param)).toStrictEqual(
          testCase.result,
        );
      });
    });
  });
});
