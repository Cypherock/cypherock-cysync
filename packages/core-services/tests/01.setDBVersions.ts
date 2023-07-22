import { describe, expect, test } from '@jest/globals';

import { setDBVersions } from '../src';

describe('01. setDBVersions', () => {
  test(`should export setDBVersions`, async () => {
    expect(setDBVersions).toBeDefined();
  });
});
