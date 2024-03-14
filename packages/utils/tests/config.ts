import { expect, test } from '@jest/globals';

describe('config', () => {
  test('should export config object', async () => {
    const { config } = await import('../src/config');
    expect(config).toBeDefined();
  });

  test('should have LOG_LEVEL property', async () => {
    const { config } = await import('../src/config');
    expect(config.LOG_LEVEL).toBeDefined();
  });

  test('should have LOG_LEVEL property with default value', async () => {
    const { config } = await import('../src/config');
    expect(config.LOG_LEVEL).toEqual('debug');
  });

  test('should read LOG_LEVEL property from env', async () => {
    const key = 'LOG_LEVEL';
    const value = 'info';

    // Simulate node environment
    (global as any).process.env = Object.assign(process.env ?? {}, {
      [key]: value,
    });

    jest.resetModules();
    const { config } = await import('../src/config');

    expect(config.LOG_LEVEL).toEqual(value);
  });
});
