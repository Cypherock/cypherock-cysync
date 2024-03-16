import { describe, expect, test } from '@jest/globals';
import { objectToClonableObject } from '../../src';
import { fixtures } from './__fixtures__';

describe('objectToClonableObject', () => {
  test('should export objectToClonableObject function', () => {
    expect(objectToClonableObject).toBeDefined();
  });

  describe('should return the defined result', () => {
    fixtures.valid.forEach(testCase => {
      test(testCase.name, () => {
        expect(objectToClonableObject(testCase.param)).toStrictEqual(
          testCase.result,
        );
      });
    });
  });
});
