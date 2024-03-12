import { expect, test } from '@jest/globals';
import { config } from '../src/config';

describe('config', () => {
  test('should export config object', async () => {
    expect(config).toBeDefined();
  });
  test('should have LOG_LEVEL property', async () => {
    expect(config.LOG_LEVEL).toBeDefined();
  });
  test('should have LOG_LEVEL property with default value', async () => {
    expect(config.LOG_LEVEL).toEqual('debug');
  });
});
