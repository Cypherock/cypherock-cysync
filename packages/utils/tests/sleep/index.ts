import { describe, expect, test } from '@jest/globals';

import { sleep } from '../../src';
import { fixtures } from './__fixtures__';

describe('sleep', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('should export sleep function', () => {
    expect(sleep).toBeDefined();
  });

  describe('should resolve for valid time', () => {
    fixtures.valid.forEach(time => {
      test(`should resolve after ${time}ms`, async () => {
        const start = Date.now();
        const promise = sleep(time);
        jest.advanceTimersByTime(time);
        const end = Date.now();
        await expect(promise).resolves.toBeUndefined();
        expect(end - start).toBeGreaterThanOrEqual(time);
      });
    });
  });

  describe('should reject for invalid time', () => {
    fixtures.invalid.forEach(time => {
      test(`should reject for invalid time: ${time}`, async () => {
        await expect(sleep(time)).rejects.toThrowError('Invalid time');
      });
    });
  });
});
