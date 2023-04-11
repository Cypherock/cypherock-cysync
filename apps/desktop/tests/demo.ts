import { describe, expect, test } from '@jest/globals';

import createApplication from '../src/app';

describe('Export test', () => {
  test('should be exported', async () => {
    expect(createApplication).toBeDefined();
  });
});
