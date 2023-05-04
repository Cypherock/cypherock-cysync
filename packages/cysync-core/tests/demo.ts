import { describe, expect, test } from '@jest/globals';

import { Splash } from '../src/pages/OnBoarding/GetStarted/Splash';

describe('Export test', () => {
  test('should export render function', async () => {
    expect(Splash).toBeDefined();
  });
});
