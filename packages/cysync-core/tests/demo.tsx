import { describe, expect, test } from '@jest/globals';
import { DeviceDetection } from '../src';

describe('Export test', () => {
  test('should export render function', async () => {
    expect(DeviceDetection).toBeDefined();
  });
});
