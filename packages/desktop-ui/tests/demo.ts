import { describe, expect, test } from '@jest/globals';

import { render } from '../src/index';

describe('Export test', () => {
  test('should export render function', async () => {
    expect(render).toBeDefined();
  });
});
