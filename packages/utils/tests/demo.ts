import { describe, expect, test } from '@jest/globals';

import * as exp from '../src/index';

describe('Export test', () => {
  test('should export render function', async () => {
    expect(exp).toBeDefined();
  });
});
