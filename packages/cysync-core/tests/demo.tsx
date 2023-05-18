import { describe, expect, test } from '@jest/globals';

import { DeviceAuthTest } from '../src';

describe('Export test', () => {
  test('should export render function', async () => {
    expect(DeviceAuthTest).toBeDefined();
  });
});
