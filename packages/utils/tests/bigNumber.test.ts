import { describe, expect, test } from '@jest/globals';

import BigNumberJS from 'bignumber.js';
import { BigNumber } from '../src';

describe('BigNumber', () => {
  test('should export BigNumber', async () => {
    expect(BigNumber).toBeDefined();
  });

  describe('should export static variables and functions', () => {
    test('should export ROUND_CEIL', async () => {
      expect(BigNumber.ROUND_CEIL).toBeDefined();
    });

    test('should export ROUND_FLOOR', async () => {
      expect(BigNumber.ROUND_FLOOR).toBeDefined();
    });

    test('should export max', async () => {
      expect(BigNumber.max).toBeDefined();
    });

    test('should export maximum', async () => {
      expect(BigNumber.maximum).toBe(BigNumber.max);
    });

    test('should export min', async () => {
      expect(BigNumber.min).toBeDefined();
    });

    test('should export minimum', async () => {
      expect(BigNumber.minimum).toBe(BigNumber.min);
    });
  });

  describe('should instantiate BigNumber', () => {
    test('should create BigNumber instance with number', async () => {
      const number = new BigNumber(1);
      expect(number).toBeInstanceOf(BigNumber);
    });

    test('should create BigNumber instance with string', async () => {
      const number = new BigNumber('123456789012345678901234567890');
      expect(number).toBeInstanceOf(BigNumber);
      expect(number.toFixed()).toBe('123456789012345678901234567890');
    });

    test('should create BigNumber instance with BigNumber', async () => {
      const number = new BigNumber(new BigNumber(1));
      expect(number).toBeInstanceOf(BigNumber);
    });
  });

  describe('BigNumber.max', () => {
    test('should return max number', async () => {
      const num1 = new BigNumber(12);
      const num2 = new BigNumber('-123456789012345678901234567890');
      const num3 = new BigNumber('123456789012345678901234567890');
      const result = BigNumber.max(num1, num2, num3);
      expect(result.toFixed()).toBe('123456789012345678901234567890');
    });
  });

  describe('BigNumber.min', () => {
    test('should return min number', async () => {
      const num1 = new BigNumber(12);
      const num2 = new BigNumber('-123456789012345678901234567890');
      const num3 = new BigNumber('123456789012345678901234567890');
      const result = BigNumber.min(num1, num2, num3);
      expect(result.toFixed()).toBe('-123456789012345678901234567890');
    });
  });

  describe('BigNumber.getRawNumber', () => {
    test('should return raw number', async () => {
      const number = new BigNumber(1);
      const result = number.getRawNumber();
      expect(result).toBeInstanceOf(BigNumberJS);
    });
  });

  describe('BigNumber.plus', () => {
    test('should add two numbers', async () => {
      const number = new BigNumber(1);
      const result = number.plus(1);
      expect(result.toFixed()).toBe('2');
    });

    test('should add two big Numbers', async () => {
      const num1 = new BigNumber('-123456789012345678901234567890');
      const num2 = new BigNumber('123456789012345678901234567891');
      const result = num1.plus(num2);
      expect(result.toFixed()).toBe('1');
    });

    test('should add two numbers with different base', async () => {
      const number = new BigNumber(1);
      const result = number.plus('11', 2);
      expect(result.toFixed()).toBe('4');
    });
  });

  describe('BigNumber.minus', () => {
    test('should subtract two numbers', () => {
      const number = new BigNumber(1);
      const result = number.minus(1);
      expect(result.toFixed()).toBe('0');
    });

    test('should subtract two big Numbers', async () => {
      const num1 = new BigNumber('-123456789012345678901234567890');
      const num2 = new BigNumber(1);
      const result = num1.minus(num2);
      expect(result.toFixed()).toBe('-123456789012345678901234567891');
    });

    test('should subtract two numbers with different base', async () => {
      const number = new BigNumber(1);
      const result = number.minus('11', 2);
      expect(result.toFixed()).toBe('-2');
    });
  });

  describe('BigNumber.multipliedBy', () => {
    test('should multiply two numbers', async () => {
      const number = new BigNumber(12);
      const result = number.multipliedBy(2);
      expect(result.toFixed()).toBe('24');
    });

    test('should multiply two big Numbers', async () => {
      const num1 = new BigNumber('-12345678901234567890');
      const num2 = new BigNumber(10000000000);
      const result = num1.multipliedBy(num2);
      expect(result.toFixed()).toBe('-123456789012345678900000000000');
    });

    test('should multiply two numbers with different base', async () => {
      const number = new BigNumber(12);
      const result = number.multipliedBy('11', 2);
      expect(result.toFixed()).toBe('36');
    });
  });

  describe('BigNumber.dividedBy', () => {
    test('should divide two numbers', async () => {
      const number = new BigNumber(12);
      const result = number.dividedBy(2);
      expect(result.toFixed()).toBe('6');
    });

    test('should divide two big Numbers', async () => {
      const num1 = new BigNumber('-2468024680246802468024680');
      const num2 = new BigNumber('2');
      const result = num1.dividedBy(num2);
      expect(result.toFixed()).toBe('-1234012340123401234012340');
    });

    test('should divide two numbers with different base', async () => {
      const number = new BigNumber(12);
      const result = number.dividedBy('11', 2);
      expect(result.toFixed()).toBe('4');
    });
  });

  describe('BigNumber.mod and BigNumber.modulo', () => {
    test('should return mod of two numbers', async () => {
      const number = new BigNumber(12);
      const result = number.mod(5);
      expect(result.toFixed()).toBe('2');
    });

    test('should return mod of two numbers with different base', async () => {
      const number = new BigNumber(13);
      const result = number.mod('11', 2);
      expect(result.toFixed()).toBe('1');
    });
    test('should return modulo of two numbers', async () => {
      const number = new BigNumber(12);
      const result = number.modulo(5);
      expect(result.toFixed()).toBe('2');
    });

    test('should return modulo of two numbers with different base', async () => {
      const number = new BigNumber(13);
      const result = number.modulo('11', 2);
      expect(result.toFixed()).toBe('1');
    });
  });

  describe('BigNumber.pow', () => {
    test('should return power of number', async () => {
      const number = new BigNumber(12);
      const result = number.pow(2);
      expect(result.toFixed()).toBe('144');
    });

    test('should return power two big Numbers', async () => {
      const num1 = new BigNumber('-100000000000000000000');
      const num2 = new BigNumber(2);
      const result = num1.pow(num2);
      expect(result.toFixed()).toBe(
        '10000000000000000000000000000000000000000',
      );
    });

    test('should return power of number with modulo', async () => {
      const number = new BigNumber(12);
      const result = number.pow(2, 17);
      expect(result.toFixed()).toBe('8');
    });

    test('should return power of decimal number', () => {
      const number = new BigNumber(12.12);
      const result = number.pow(2);
      expect(result.toFixed()).toBe('146.8944');
    });
  });

  describe('BigNumber.abs', () => {
    test('should return absolute of negative', async () => {
      const number = new BigNumber(-12);
      const result = number.abs();
      expect(result.toFixed()).toBe('12');
    });
    test('should return absolute of zero', async () => {
      const number = new BigNumber(0);
      const result = number.abs();
      expect(result.toFixed()).toBe('0');
    });
    test('should return absolute of positive', async () => {
      const number = new BigNumber(12);
      const result = number.abs();
      expect(result.toFixed()).toBe('12');
    });
  });

  describe('BigNumber.isNegative', () => {
    test('should return false if number is positive', async () => {
      const number = new BigNumber(12);
      const result = number.isNegative();
      expect(result).toBe(false);
    });

    test('should return false if number is zero', async () => {
      const number = new BigNumber(0);
      const result = number.isNegative();
      expect(result).toBe(false);
    });

    test('should return true if number is negative', async () => {
      const number = new BigNumber(-12);
      const result = number.isNegative();
      expect(result).toBe(true);
    });

    test('should return true if numbers are zero', async () => {
      const plusZero = new BigNumber(+0);
      const minusZero = new BigNumber(-0);
      expect(plusZero.isNegative()).toBe(false);
      expect(minusZero.isNegative()).toBe(false);
    });
  });

  describe('BigNumber.isZero', () => {
    test('should return true if number is zero', async () => {
      const number = new BigNumber(0);
      const result = number.isZero();
      expect(result).toBe(true);
    });

    test('should return false when number is positive', async () => {
      const positiveNumber = new BigNumber(1);
      expect(positiveNumber.isZero()).toBe(false);
    });

    test('should return false when number is negative', async () => {
      const negativeNumber = new BigNumber(1);
      expect(negativeNumber.isZero()).toBe(false);
    });
  });

  describe('BigNumber.isInteger', () => {
    test('should return true if number is integer', async () => {
      const number = new BigNumber(12);
      const result = number.isInteger();
      expect(result).toBe(true);
    });

    test('should return false if number is not integer', async () => {
      const number = new BigNumber(12.3);
      const result = number.isInteger();
      expect(result).toBe(false);
    });
  });

  describe('BigNumber.isGreaterThan', () => {
    test('should return true if number is greater', async () => {
      const number = new BigNumber(12);
      const result = number.isGreaterThan(11);
      expect(result).toBe(true);
    });

    test('should return false if number is equal', async () => {
      const number = new BigNumber(12);
      const result = number.isGreaterThan(12);
      expect(result).toBe(false);
    });

    test('should return false if number is smaller', async () => {
      const number = new BigNumber(11);
      const result = number.isGreaterThan(12);
      expect(result).toBe(false);
    });
  });

  describe('BigNumber.isGreaterThanOrEqualTo', () => {
    test('should return true if number is greater', async () => {
      const number = new BigNumber(12);
      const result = number.isGreaterThanOrEqualTo(11);
      expect(result).toBe(true);
    });

    test('should return true if number is equal', async () => {
      const number = new BigNumber(12);
      const result = number.isGreaterThanOrEqualTo(12);
      expect(result).toBe(true);
    });

    test('should return false if number is smaller', async () => {
      const number = new BigNumber(11);
      const result = number.isGreaterThanOrEqualTo(12);
      expect(result).toBe(false);
    });

    test('should return true if numbers are zero', async () => {
      const plusZero = new BigNumber(+0);
      const minusZero = new BigNumber(-0);
      expect(plusZero.isGreaterThanOrEqualTo(minusZero)).toBe(true);
      expect(minusZero.isGreaterThanOrEqualTo(plusZero)).toBe(true);
    });
  });

  describe('BigNumber.isLessThan', () => {
    test('should return true if number is smaller', async () => {
      const number = new BigNumber(11);
      const result = number.isLessThan(12);
      expect(result).toBe(true);
    });

    test('should return false if number is equal', async () => {
      const number = new BigNumber(12);
      const result = number.isLessThan(12);
      expect(result).toBe(false);
    });

    test('should return false if number is greater', async () => {
      const number = new BigNumber(12);
      const result = number.isLessThan(11);
      expect(result).toBe(false);
    });
  });

  describe('BigNumber.isLessThanOrEqualTo', () => {
    test('should return true if number is smaller', async () => {
      const number = new BigNumber(11);
      const result = number.isLessThanOrEqualTo(12);
      expect(result).toBe(true);
    });

    test('should return true if number is equal', async () => {
      const number = new BigNumber(12);
      const result = number.isLessThanOrEqualTo(12);
      expect(result).toBe(true);
    });

    test('should return false if number is greater', async () => {
      const number = new BigNumber(12);
      const result = number.isLessThanOrEqualTo(11);
      expect(result).toBe(false);
    });

    test('should return true if numbers are zero', async () => {
      const plusZero = new BigNumber(+0);
      const minusZero = new BigNumber(-0);
      expect(plusZero.isLessThanOrEqualTo(minusZero)).toBe(true);
      expect(minusZero.isLessThanOrEqualTo(plusZero)).toBe(true);
    });
  });

  describe('BigNumber.isNaN', () => {
    test('should return true if number is NaN', async () => {
      const number = new BigNumber(NaN);
      const result = number.isNaN();
      expect(result).toBe(true);
    });
    test('should return false if number is not NaN', async () => {
      const number = new BigNumber(1);
      const result = number.isNaN();
      expect(result).toBe(false);
    });
  });

  describe('BigNumber.isPositive', () => {
    test('should return true if number is positive', async () => {
      const number = new BigNumber(12);
      const result = number.isPositive();
      expect(result).toBe(true);
    });

    test('should return false if number is zero', async () => {
      const plusZero = new BigNumber(+0);
      const minusZero = new BigNumber(-0);

      expect(plusZero.isPositive()).toBe(false);
      expect(minusZero.isPositive()).toBe(false);
    });

    test('should return false if number is negative', async () => {
      const number = new BigNumber(-12);
      const result = number.isPositive();
      expect(result).toBe(false);
    });
  });

  describe('BigNumber.toNumber', () => {
    test('should return number', async () => {
      const number = new BigNumber(12);
      const result = number.toNumber();
      expect(result).toBe(12);
    });
  });

  describe('BigNumber.toString', () => {
    test('should return string', async () => {
      const number = new BigNumber(12);
      const result = number.toString();
      expect(result).toBe('12');
    });
    test('should return string with base', async () => {
      const number = new BigNumber(12);
      const result = number.toString(2);
      expect(result).toBe('1100');
    });
  });

  describe('BigNumber.toFixed', () => {
    test('should return string with unrounded decimal places', async () => {
      const number = new BigNumber(12.12634);
      const result = number.toFixed();
      expect(result).toBe('12.12634');
    });

    test('should return string with rounded decimal places ', async () => {
      const number = new BigNumber(12.12534);
      const result = number.toFixed(2);
      expect(result).toBe('12.13');
    });

    test('should return string with rounded decimal places and ceil rounding mode', async () => {
      const positiveNumber = new BigNumber(12.12634);
      expect(positiveNumber.toFixed(2, BigNumber.ROUND_CEIL)).toBe('12.13');
      expect(positiveNumber.toFixed(2, BigNumber.ROUND_FLOOR)).toBe('12.12');

      const negativeNumber = new BigNumber(-12.12634);
      expect(negativeNumber.toFixed(2, BigNumber.ROUND_CEIL)).toBe('-12.12');
      expect(negativeNumber.toFixed(2, BigNumber.ROUND_FLOOR)).toBe('-12.13');
    });
  });

  describe('BigNumber.toPrecision', () => {
    test('should return string with unrounded decimal places', async () => {
      const number = new BigNumber(12.12634);
      expect(number.toPrecision(1)).toBe('1e+1');
      expect(number.toPrecision(2)).toBe('12');
      expect(number.toPrecision(3)).toBe('12.1');
    });

    test('should return string with rounded decimal places ', async () => {
      const number = new BigNumber(12.12534);
      expect(number.toPrecision(4)).toBe('12.13');
    });

    test('should return string with rounded decimal places and ceil rounding mode', async () => {
      const positiveNumber = new BigNumber(12.12634);
      expect(positiveNumber.toPrecision(4, BigNumber.ROUND_CEIL)).toBe('12.13');
      expect(positiveNumber.toPrecision(4, BigNumber.ROUND_FLOOR)).toBe(
        '12.12',
      );

      const negativeNumber = new BigNumber(-12.12634);
      expect(negativeNumber.toPrecision(4, BigNumber.ROUND_CEIL)).toBe(
        '-12.12',
      );
      expect(negativeNumber.toPrecision(4, BigNumber.ROUND_FLOOR)).toBe(
        '-12.13',
      );
    });
  });

  describe('BigNumber.compareTo', () => {
    test('should return 1 if number is greater', async () => {
      const number = new BigNumber(12);
      const result = number.compareTo(11);
      expect(result).toBe(1);
    });

    test('should return 0 if number is equal', async () => {
      const number = new BigNumber(12);
      const result = number.compareTo(12);
      expect(result).toBe(0);
    });

    test('should return -1 if number is smaller', async () => {
      const number = new BigNumber(11);
      const result = number.compareTo(12);
      expect(result).toBe(-1);
    });
  });
});
