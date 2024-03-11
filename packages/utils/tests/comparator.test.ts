import { describe, expect, test } from '@jest/globals';

import { createComparator } from '../src';

describe('createComparator', () => {
  test('should export createComparator function', async () => {
    expect(createComparator).toBeDefined();
  });

  test('should return a function', async () => {
    const compare = createComparator('key', 'string');
    expect(typeof compare).toBe('function');
  });

  describe('compare string', () => {
    test('should return a function that returns 1 when comparing a greater string', async () => {
      const compare = createComparator('key', 'string');
      const a = { key: 'aaaaaaa' };
      const b = { key: 'aaab' };
      expect(compare(a, b)).toBe(1);
    });

    test('should return a function that returns 1 when comparing a greater homogeneous string', async () => {
      const compare = createComparator('key', 'string');
      const a = { key: 'aaaaaaa' };
      const b = { key: 'aaa' };
      expect(compare(b, a)).toBe(1);
    });

    test('should return a function that returns -1 when comparing a lesser string', async () => {
      const compare = createComparator('key', 'string');
      const a = { key: 'aaaaaaa' };
      const b = { key: 'aaab' };
      expect(compare(b, a)).toBe(-1);
    });

    test('should return a function that returns 0 when comparing equal strings', async () => {
      const compare = createComparator('key', 'string');
      const a = { key: 'aaaa' };
      const b = { key: 'aaaa' };
      expect(compare(a, b)).toBe(0);
    });
  });

  describe('compare number', () => {
    test('should return a function that returns 1 when comparing a greater number', async () => {
      const compare = createComparator('key', 'number');
      const a = { key: 100 };
      const b = { key: 101 };
      expect(compare(a, b)).toBe(1);
    });

    test('should return a function that returns -1 when comparing a lesser number', async () => {
      const compare = createComparator('key', 'number');
      const a = { key: 100 };
      const b = { key: 101 };
      expect(compare(b, a)).toBe(-1);
    });

    test('should return a function that returns 0 when comparing equal numbers', async () => {
      const compare = createComparator('key', 'number');
      const a = { key: 100 };
      const b = { key: 100 };
      expect(compare(a, b)).toBe(0);
    });
  });
});
