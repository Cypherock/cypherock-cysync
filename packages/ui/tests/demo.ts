import { describe, expect, test } from '@jest/globals';

import { Button } from '../src/index';

describe('Export test', () => {
  test('should be exported', async () => {
    expect(Button).toBeDefined();
  });
});
