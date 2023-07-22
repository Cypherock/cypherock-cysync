import { describe, expect, test } from '@jest/globals';
import { runCli } from './__helpers__/exec';

describe('Help', () => {
  test('should be able to get help result', async () => {
    const result = await runCli(['--help']);
    expect(result).toBeDefined();
  });
});
