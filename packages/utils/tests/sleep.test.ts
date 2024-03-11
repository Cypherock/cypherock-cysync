import { describe, expect, test } from '@jest/globals';

import { sleep } from '../src';

describe('sleep', () => {
  test('should export sleep function', () => {
    expect(sleep).toBeDefined();
  });

  test('should resolve after given time', async () => {
    const time = 200;
    const start = Date.now();
    await sleep(time);
    const end = Date.now();
    expect(end - start).toBeGreaterThanOrEqual(time);
  });
});
