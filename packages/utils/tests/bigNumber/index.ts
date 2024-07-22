import { describe, expect, test } from '@jest/globals';

import BigNumberJS from 'bignumber.js';
import { BigNumber } from '../../src';
import { fixtures } from './__fixtures__';

describe('BigNumber', () => {
  test('should export BigNumber', async () => {
    expect(BigNumber).toBeDefined();
  });

  describe('should export static variables', () => {
    fixtures.valid.staticVariables.forEach(({ name, variable }) => {
      test(name, async () => {
        expect(variable).toBeDefined();
      });
    });
  });

  describe('should export static methods', () => {
    fixtures.valid.staticMethods.forEach(({ name, method }) => {
      test(name, async () => {
        expect(method).toBeDefined();
        expect(method).toBeInstanceOf(Function);
      });
    });
  });

  describe('should instantiate BigNumber', () => {
    fixtures.valid.initialisation.forEach(
      ({ name, number, base, expected }) => {
        test(name, async () => {
          const numberBn = new BigNumber(number, base);
          expect(numberBn).toBeInstanceOf(BigNumber);
          expect(numberBn.toFixed()).toBe(expected);
        });
      },
    );
  });

  describe('BigNumber.max', () => {
    fixtures.valid.max.forEach(({ name, nums, expected }) => {
      test(name, async () => {
        const result = BigNumber.max(...nums);
        expect(result.toFixed()).toBe(expected);
      });
    });
  });

  describe('BigNumber.min', () => {
    fixtures.valid.min.forEach(({ name, nums, expected }) => {
      test(name, async () => {
        const result = BigNumber.min(...nums);
        expect(result.toFixed()).toBe(expected);
      });
    });
  });

  describe('BigNumber.getRawNumber', () => {
    fixtures.valid.getRawNumber.forEach(({ name, expected, number }) => {
      test(name, async () => {
        const numberBn = new BigNumber(number);
        const result = numberBn.getRawNumber();
        expect(result).toBeInstanceOf(BigNumberJS);
        expect(result.toFixed()).toBe(expected);
      });
    });
  });

  describe('BigNumber.plus', () => {
    fixtures.valid.plus.forEach(({ name, num1, num2, num2Base, expected }) => {
      test(name, () => {
        const numberBn = new BigNumber(num1);
        const result = numberBn.plus(num2, num2Base);
        expect(result.toFixed()).toBe(expected);
      });
    });
  });

  describe('BigNumber.minus', () => {
    fixtures.valid.minus.forEach(({ name, num1, num2, num2Base, expected }) => {
      test(name, () => {
        const numberBn = new BigNumber(num1);
        const result = numberBn.minus(num2, num2Base);
        expect(result.toFixed()).toBe(expected);
      });
    });
  });

  describe('BigNumber.multipliedBy', () => {
    fixtures.valid.multipliedBy.forEach(
      ({ name, num1, num2, num2Base, expected }) => {
        test(name, () => {
          const numberBn = new BigNumber(num1);
          const result = numberBn.multipliedBy(num2, num2Base);
          expect(result.toFixed()).toBe(expected);
        });
      },
    );
  });

  describe('BigNumber.dividedBy', () => {
    fixtures.valid.dividedBy.forEach(
      ({ name, num1, num2, num2Base, expected }) => {
        test(name, () => {
          const numberBn = new BigNumber(num1);
          const result = numberBn.dividedBy(num2, num2Base);
          expect(result.toFixed()).toBe(expected);
        });
      },
    );
  });

  describe('BigNumber.mod', () => {
    fixtures.valid.mod.forEach(({ name, number, modBy, base, expected }) => {
      test(name, () => {
        const numberBn = new BigNumber(number);
        const result = numberBn.mod(modBy, base);
        expect(result.toFixed()).toBe(expected);
      });
    });
  });

  describe('BigNumber.modulo', () => {
    fixtures.valid.mod.forEach(({ name, number, modBy, base, expected }) => {
      test(name, () => {
        const numberBn = new BigNumber(number);
        const result = numberBn.modulo(modBy, base);
        expect(result.toFixed()).toBe(expected);
      });
    });
  });

  describe('BigNumber.pow', () => {
    fixtures.valid.pow.forEach(({ name, number, power, modBy, expected }) => {
      test(name, () => {
        const numberBn = new BigNumber(number);
        const result = numberBn.pow(power, modBy);
        expect(result.toFixed()).toBe(expected);
      });
    });
  });

  describe('BigNumber.abs', () => {
    fixtures.valid.abs.forEach(({ name, number, expected }) => {
      test(name, () => {
        const numberBn = new BigNumber(number);
        const result = numberBn.abs();
        expect(result.toFixed()).toBe(expected);
      });
    });
  });

  describe('BigNumber.isNegative', () => {
    fixtures.valid.isNegative.forEach(({ name, number, expected }) => {
      test(name, () => {
        const numberBn = new BigNumber(number);
        expect(numberBn.isNegative()).toBe(expected);
      });
    });
  });

  describe('BigNumber.isZero', () => {
    fixtures.valid.isZero.forEach(({ name, number, expected }) => {
      test(name, () => {
        const numberBn = new BigNumber(number);
        expect(numberBn.isZero()).toBe(expected);
      });
    });
  });

  describe('BigNumber.isInteger', () => {
    fixtures.valid.isInteger.forEach(({ name, number, expected }) => {
      test(name, () => {
        const numberBn = new BigNumber(number);
        expect(numberBn.isInteger()).toBe(expected);
      });
    });
  });

  describe('BigNumber.isGreaterThan', () => {
    fixtures.valid.isGreaterThan.forEach(({ name, num1, num2, expected }) => {
      test(name, () => {
        const number = new BigNumber(num1);
        const result = number.isGreaterThan(num2);
        expect(result).toBe(expected);
      });
    });
  });

  describe('BigNumber.isGreaterThanOrEqualTo', () => {
    fixtures.valid.isGreaterThanOrEqualTo.forEach(
      ({ name, num1, num2, expected }) => {
        test(name, () => {
          const number = new BigNumber(num1);
          const result = number.isGreaterThanOrEqualTo(num2);
          expect(result).toBe(expected);
        });
      },
    );
  });

  describe('BigNumber.isLessThan', () => {
    fixtures.valid.isLessThan.forEach(({ name, num1, num2, expected }) => {
      test(name, () => {
        const number = new BigNumber(num1);
        const result = number.isLessThan(num2);
        expect(result).toBe(expected);
      });
    });
  });

  describe('BigNumber.isLessThanOrEqualTo', () => {
    fixtures.valid.isLessThanOrEqualTo.forEach(
      ({ name, num1, num2, expected }) => {
        test(name, () => {
          const number = new BigNumber(num1);
          const result = number.isLessThanOrEqualTo(num2);
          expect(result).toBe(expected);
        });
      },
    );
  });

  describe('BigNumber.isNaN', () => {
    fixtures.valid.isNaN.forEach(({ name, number, expected }) => {
      test(name, () => {
        const numberBn = new BigNumber(number);
        expect(numberBn.isNaN()).toBe(expected);
      });
    });
  });

  describe('BigNumber.isPositive', () => {
    fixtures.valid.isPositive.forEach(({ name, number, expected }) => {
      test(name, () => {
        const numberBn = new BigNumber(number);
        expect(numberBn.isPositive()).toBe(expected);
      });
    });
  });

  describe('BigNumber.toNumber', () => {
    fixtures.valid.toNumber.forEach(({ name, number, expected }) => {
      test(name, () => {
        const numberBn = new BigNumber(number);
        expect(numberBn.toNumber()).toBe(expected);
      });
    });
  });

  describe('BigNumber.toString', () => {
    fixtures.valid.toString.forEach(({ name, number, base, expected }) => {
      test(name, () => {
        const numberBn = new BigNumber(number);
        expect(numberBn.toString(base)).toBe(expected);
      });
    });
  });

  describe('BigNumber.toFixed', () => {
    fixtures.valid.toFixed.forEach(
      ({ name, number, decimalPlaces, expected, mode }) => {
        test(name, () => {
          const numberBn = new BigNumber(number);
          expect(numberBn.toFixed(decimalPlaces, mode)).toBe(expected);
        });
      },
    );
  });

  describe('BigNumber.toPrecision', () => {
    fixtures.valid.toPrecision.forEach(
      ({ name, number, precision, expected, mode }) => {
        test(name, () => {
          const numberBn = new BigNumber(number);
          expect(numberBn.toPrecision(precision, mode)).toBe(expected);
        });
      },
    );
  });

  describe('BigNumber.compareTo', () => {
    fixtures.valid.compareTo.forEach(({ name, num1, num2, expected }) => {
      test(name, async () => {
        const number = new BigNumber(num1);
        const result = number.compareTo(num2);
        expect(result).toBe(expected);
      });
    });
  });
});
