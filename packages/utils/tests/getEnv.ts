import { beforeEach, describe, expect, test } from '@jest/globals';

import { getEnvVariable } from '../src';

describe('getEnvVariable', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  test('should export getEnvVariable function', () => {
    expect(getEnvVariable).toBeDefined();
  });

  test('should throw error when env variable not found', () => {
    expect(() => getEnvVariable('RANDOM_KEY')).toThrow(
      "ENVIRONMENT VARIABLE 'RANDOM_KEY' NOT SPECIFIED.",
    );
  });

  test('should return default value when env variable not found', () => {
    expect(getEnvVariable('RANDOM_KEY', 'default-value')).toBe('default-value');
  });

  test('should check window.cysyncEnv if process.env is not available', () => {
    const key = 'TEST_KEY';
    const value = 'test-value';

    // Simulate browser environment
    delete (global as any).process.env;
    (global as any).window = { cysyncEnv: { [key]: value } };

    expect(getEnvVariable(key)).toBe(value);
  });

  test('should return value from process.env', () => {
    const key = 'TEST_KEY';
    const value = 'test-value';

    // Simulate node environment
    (global as any).process.env = Object.assign(process.env ?? {}, {
      [key]: value,
    });

    const result = getEnvVariable(key);
    expect(result).toEqual(value);
  });
});
