import { BigNumber } from '../../../src/bigNumber';
import { BigNumberValidTestCase } from './types';

export const valid: BigNumberValidTestCase = {
  staticVariables: [
    {
      name: 'ROUND_CEIL',
      variable: BigNumber.ROUND_CEIL,
    },
    {
      name: 'ROUND_FLOOR',
      variable: BigNumber.ROUND_FLOOR,
    },
  ],
  staticMethods: [
    {
      name: 'max',
      method: BigNumber.max,
    },
    {
      name: 'maximum',
      method: BigNumber.maximum,
    },
    {
      name: 'min',
      method: BigNumber.min,
    },
    {
      name: 'minimum',
      method: BigNumber.minimum,
    },
  ],
  initialisation: [
    {
      name: 'create BigNumber instance with number',
      number: 1,
      expected: '1',
    },
    {
      name: 'create BigNumber instance with string',
      number: '123456789012345678901234567890',
      expected: '123456789012345678901234567890',
    },
    {
      name: 'create BigNumber instance with BigNumber',
      number: new BigNumber(1),
      expected: '1',
    },
  ],
  max: [
    {
      name: 'should return max number',
      nums: [
        12,
        '-123456789012345678901234567890',
        '123456789012345678901234567890',
      ],
      expected: '123456789012345678901234567890',
    },
  ],
  min: [
    {
      name: 'should return min number',
      nums: [
        12,
        '-123456789012345678901234567890',
        '123456789012345678901234567890',
      ],
      expected: '-123456789012345678901234567890',
    },
  ],
  getRawNumber: [
    {
      name: 'should return raw number',
      number: 1,
      expected: '1',
    },
  ],
  plus: [
    {
      name: 'should add two numbers',
      num1: 1,
      num2: 1,
      expected: '2',
    },
    {
      name: 'should add two big Numbers',
      num1: '-123456789012345678901234567890',
      num2: '123456789012345678901234567891',
      expected: '1',
    },
    {
      name: 'should add two numbers with different base',
      num1: 1,
      num2: '11',
      num2Base: 2,
      expected: '4',
    },
  ],
  minus: [
    {
      name: 'should subtract two numbers',
      num1: 1,
      num2: 1,
      expected: '0',
    },
    {
      name: 'should subtract two big Numbers',
      num1: '-123456789012345678901234567890',
      num2: 1,
      expected: '-123456789012345678901234567891',
    },
    {
      name: 'should subtract two numbers with different base',
      num1: 1,
      num2: '11',
      num2Base: 2,
      expected: '-2',
    },
  ],
  multipliedBy: [
    {
      name: 'should multiply two numbers',
      num1: 12,
      num2: 2,
      expected: '24',
    },
    {
      name: 'should multiply two big Numbers',
      num1: '-12345678901234567890',
      num2: 10000000000,
      expected: '-123456789012345678900000000000',
    },
    {
      name: 'should multiply two numbers with different base',
      num1: 12,
      num2: '11',
      num2Base: 2,
      expected: '36',
    },
  ],
  dividedBy: [
    {
      name: 'should divide two numbers',
      num1: 12,
      num2: 2,
      expected: '6',
    },
    {
      name: 'should divide two big Numbers',
      num1: '-2468024680246802468024680',
      num2: '2',
      expected: '-1234012340123401234012340',
    },
    {
      name: 'should divide two numbers with different base',
      num1: 12,
      num2: '11',
      num2Base: 2,
      expected: '4',
    },
  ],
  mod: [
    {
      name: 'should return mod of two numbers',
      number: 12,
      modBy: 5,
      expected: '2',
    },
    {
      name: 'should return mod of two numbers with different base',
      number: 13,
      modBy: '11',
      base: 2,
      expected: '1',
    },
  ],
  pow: [
    {
      name: 'should return power of number',
      number: new BigNumber(12),
      power: new BigNumber(2),
      expected: '144',
    },
    {
      name: 'should return power two big Numbers',
      number: new BigNumber('-100000000000000000000'),
      power: new BigNumber(2),
      expected: '10000000000000000000000000000000000000000',
    },
    {
      name: 'should return power of number with modulo',
      number: new BigNumber(12),
      power: new BigNumber(2),
      modBy: new BigNumber(17),
      expected: '8',
    },
    {
      name: 'should return power of decimal number',
      number: new BigNumber(12.12),
      power: new BigNumber(2),
      expected: '146.8944',
    },
  ],
  abs: [
    {
      name: 'should return absolute of negative',
      number: new BigNumber(-12),
      expected: '12',
    },
    {
      name: 'should return absolute of zero',
      number: new BigNumber(0),
      expected: '0',
    },
    {
      name: 'should return absolute of positive',
      number: new BigNumber(12),
      expected: '12',
    },
    {
      name: 'MAX_SAFE_INTEGER',
      number: new BigNumber(Number.MAX_SAFE_INTEGER),
      expected: Number.MAX_SAFE_INTEGER.toString(),
    },
    {
      name: 'MIN_SAFE_INTEGER',
      number: new BigNumber(Number.MIN_SAFE_INTEGER),
      expected: Number.MAX_SAFE_INTEGER.toString(),
    },
    {
      name: 'Positive Infinity',
      number: new BigNumber(Infinity),
      expected: Infinity.toString(),
    },
    {
      name: 'Negative Infinity',
      number: new BigNumber(-Infinity),
      expected: Infinity.toString(),
    },
  ],
  isNegative: [
    {
      name: 'Positive Infinity',
      number: new BigNumber(Infinity),
      expected: false,
    },
    {
      name: 'MAX_SAFE_INTEGER',
      number: new BigNumber(Number.MAX_SAFE_INTEGER),
      expected: false,
    },
    {
      name: 'one',
      number: new BigNumber(1),
      expected: false,
    },
    {
      name: 'Plus Zero',
      number: new BigNumber(0),
      expected: false,
    },
    {
      name: 'Minus Zero',
      number: new BigNumber(-0),
      expected: false,
    },
    {
      name: 'minus one',
      number: new BigNumber(-1),
      expected: true,
    },
    {
      name: 'MIN_SAFE_INTEGER',
      number: new BigNumber(Number.MIN_SAFE_INTEGER),
      expected: true,
    },
    {
      name: 'Negative Infinity',
      number: new BigNumber(-Infinity),
      expected: true,
    },
  ],
  isZero: [
    {
      name: 'should return true if number is zero',
      number: new BigNumber(0),
      expected: true,
    },
    {
      name: 'should return true if number is minus zero',
      number: new BigNumber(-0),
      expected: true,
    },
    {
      name: 'should return true if number is plus zero',
      number: new BigNumber(+0),
      expected: true,
    },
    {
      name: 'should return false when number is positive',
      number: new BigNumber(1),
      expected: false,
    },
    {
      name: 'should return false when number is negative',
      number: new BigNumber(-1),
      expected: false,
    },
  ],
  isInteger: [
    {
      name: 'should return true if number is integer',
      number: new BigNumber(12),
      expected: true,
    },
    {
      name: 'should return false if number is not integer',
      number: new BigNumber(12.3),
      expected: false,
    },
  ],
  isGreaterThan: [
    {
      name: 'should return true if number is greater',
      num1: 12,
      num2: 11,
      expected: true,
    },
    {
      name: 'should return false if number is equal',
      num1: 12,
      num2: 12,
      expected: false,
    },
    {
      name: 'should return false if number is smaller',
      num1: 11,
      num2: 12,
      expected: false,
    },
    {
      name: 'should return false if numbers are zero',
      num1: +0,
      num2: -0,
      expected: false,
    },
    {
      name: 'should return false if numbers are zero',
      num1: -0,
      num2: +0,
      expected: false,
    },
  ],
  isGreaterThanOrEqualTo: [
    {
      name: 'should return true if number is greater',
      num1: 12,
      num2: 11,
      expected: true,
    },
    {
      name: 'should return true if number is equal',
      num1: 12,
      num2: 12,
      expected: true,
    },
    {
      name: 'should return false if number is smaller',
      num1: 11,
      num2: 12,
      expected: false,
    },
    {
      name: 'should return true if numbers are zero',
      num1: +0,
      num2: -0,
      expected: true,
    },
    {
      name: 'should return true if numbers are zero',
      num1: -0,
      num2: +0,
      expected: true,
    },
  ],
  isLessThan: [
    {
      name: 'should return true if number is smaller',
      num1: 11,
      num2: 12,
      expected: true,
    },
    {
      name: 'should return false if number is equal',
      num1: 12,
      num2: 12,
      expected: false,
    },
    {
      name: 'should return false if number is greater',
      num1: 12,
      num2: 11,
      expected: false,
    },
    {
      name: 'should return false if numbers are zero',
      num1: +0,
      num2: -0,
      expected: false,
    },
    {
      name: 'should return false if numbers are zero',
      num1: -0,
      num2: +0,
      expected: false,
    },
  ],
  isLessThanOrEqualTo: [
    {
      name: 'should return true if number is smaller',
      num1: 11,
      num2: 12,
      expected: true,
    },
    {
      name: 'should return true if number is equal',
      num1: 12,
      num2: 12,
      expected: true,
    },
    {
      name: 'should return false if number is greater',
      num1: 12,
      num2: 11,
      expected: false,
    },
    {
      name: 'should return true if numbers are zero',
      num1: +0,
      num2: -0,
      expected: true,
    },
    {
      name: 'should return true if numbers are zero',
      num1: -0,
      num2: +0,
      expected: true,
    },
  ],
  isNaN: [
    {
      name: 'NaN',
      number: new BigNumber(NaN),
      expected: true,
    },
    {
      name: 'Not NaN',
      number: new BigNumber(1),
      expected: false,
    },
  ],
  isPositive: [
    {
      name: 'Positive Infinity',
      number: new BigNumber(Infinity),
      expected: true,
    },
    {
      name: 'MAX_SAFE_INTEGER',
      number: new BigNumber(Number.MAX_SAFE_INTEGER),
      expected: true,
    },
    {
      name: 'one',
      number: new BigNumber(1),
      expected: true,
    },
    {
      name: 'Plus Zero',
      number: new BigNumber(0),
      expected: false,
    },
    {
      name: 'Minus Zero',
      number: new BigNumber(-0),
      expected: false,
    },
    {
      name: 'minus one',
      number: new BigNumber(-1),
      expected: false,
    },
    {
      name: 'MIN_SAFE_INTEGER',
      number: new BigNumber(Number.MIN_SAFE_INTEGER),
      expected: false,
    },
    {
      name: 'Negative Infinity',
      number: new BigNumber(-Infinity),
      expected: false,
    },
  ],
  toNumber: [
    {
      name: 'To number',
      number: new BigNumber(12),
      expected: 12,
    },
  ],
  toString: [
    {
      name: 'To string',
      number: new BigNumber(12),
      expected: '12',
    },
    {
      name: 'To string with base',
      number: new BigNumber(12),
      base: 2,
      expected: '1100',
    },
  ],
  toFixed: [
    {
      name: 'To fixed with unrounded decimal places',
      number: new BigNumber(12.12634),
      expected: '12.12634',
    },
    {
      name: 'To fixed with rounded decimal places',
      number: new BigNumber(12.12534),
      decimalPlaces: 2,
      expected: '12.13',
    },
    {
      name: 'To fixed positive number with ceil rounding mode',
      number: new BigNumber(12.12634),
      decimalPlaces: 2,
      mode: BigNumber.ROUND_CEIL,
      expected: '12.13',
    },
    {
      name: 'To fixed positive number with floor rounding mode',
      number: new BigNumber(12.12634),
      decimalPlaces: 2,
      mode: BigNumber.ROUND_FLOOR,
      expected: '12.12',
    },
    {
      name: 'To fixed negative number with ceil rounding mode',
      number: new BigNumber(-12.12634),
      decimalPlaces: 2,
      mode: BigNumber.ROUND_CEIL,
      expected: '-12.12',
    },
    {
      name: 'To fixed negative number with floor rounding mode',
      number: new BigNumber(-12.12634),
      decimalPlaces: 2,
      mode: BigNumber.ROUND_FLOOR,
      expected: '-12.13',
    },
  ],
  toPrecision: [
    {
      name: 'To precision 1 with rounded decimal places',
      number: new BigNumber(12.12634),
      precision: 1,
      expected: '1e+1',
    },
    {
      name: 'To precision 2 with rounded decimal places',
      number: new BigNumber(12.12634),
      precision: 2,
      expected: '12',
    },
    {
      name: 'To precision 3 with rounded decimal places',
      number: new BigNumber(12.12634),
      precision: 3,
      expected: '12.1',
    },
    {
      name: 'To precision 4 with rounded decimal places',
      number: new BigNumber(12.12634),
      precision: 4,
      expected: '12.13',
    },
    {
      name: 'To precision positive number with ceil rounding mode',
      number: new BigNumber(12.12634),
      precision: 4,
      mode: BigNumber.ROUND_CEIL,
      expected: '12.13',
    },
    {
      name: 'To precision positive number with floor rounding mode',
      number: new BigNumber(12.12634),
      precision: 4,
      mode: BigNumber.ROUND_FLOOR,
      expected: '12.12',
    },
    {
      name: 'To precision negative number with ceil rounding mode',
      number: new BigNumber(-12.12634),
      precision: 4,
      mode: BigNumber.ROUND_CEIL,
      expected: '-12.12',
    },
    {
      name: 'To precision negative number with floor rounding mode',
      number: new BigNumber(-12.12634),
      precision: 4,
      mode: BigNumber.ROUND_FLOOR,
      expected: '-12.13',
    },
  ],
  compareTo: [
    {
      name: 'Greater',
      num1: new BigNumber(12),
      num2: new BigNumber(11),
      expected: 1,
    },
    {
      name: 'Equal',
      num1: new BigNumber(12),
      num2: new BigNumber(12),
      expected: 0,
    },
    {
      name: 'Smaller',
      num1: new BigNumber(11),
      num2: new BigNumber(12),
      expected: -1,
    },
  ],
};
