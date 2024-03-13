import { type NumberLike, type RoundingMode } from '../../../src/bigNumber';

export type StaticVariableValidTestCase = {
  name: string;
  variable: any;
};

export type StaticMethodValidTestCase = {
  name: string;
  method: any;
};

export type InitialisationValidTestCase = {
  name: string;
  number: NumberLike;
  base?: number;
  expected: string;
};

export type MaxMinValidTestCase = {
  name: string;
  nums: NumberLike[];
  expected: string;
};

export type GetRawNumberValidTestCase = {
  name: string;
  number: NumberLike;
  expected: string;
};

export type PlusMinusMultiplyDivideValidTestCase = {
  name: string;
  num1: NumberLike;
  num2: NumberLike;
  num2Base?: number;
  expected: string;
};

export type ModValidTestCase = {
  name: string;
  number: NumberLike;
  modBy: NumberLike;
  base?: number;
  expected: string;
};

export type PowValidTestCase = {
  name: string;
  number: NumberLike;
  power: NumberLike;
  expected: string;
  modBy?: NumberLike;
};

export type AbsValidTestCase = {
  name: string;
  number: NumberLike;
  expected: string;
};

export type ValidationValidTestCase = {
  name: string;
  number: NumberLike;
  expected: boolean;
};

export type ComparisonValidTestCase = {
  name: string;
  num1: NumberLike;
  num2: NumberLike;
  expected: boolean;
};

export type ToNumberValidTestCase = {
  name: string;
  number: NumberLike;
  expected: number;
};

export type ToStringValidTestCase = {
  name: string;
  number: NumberLike;
  base?: number;
  expected: string;
};

export type ToFixedValidTestCase = {
  name: string;
  number: NumberLike;
  decimalPlaces?: number;
  mode?: RoundingMode;
  expected: string;
};

export type ToPrecisionValidTestCase = {
  name: string;
  number: NumberLike;
  precision: number;
  mode?: RoundingMode;
  expected: string;
};

export type CompareToValidTestCase = {
  name: string;
  num1: NumberLike;
  num2: NumberLike;
  expected: -1 | 0 | 1;
};

export type BigNumberValidTestCase = {
  staticVariables: StaticVariableValidTestCase[];
  staticMethods: StaticMethodValidTestCase[];
  initialisation: InitialisationValidTestCase[];
  max: MaxMinValidTestCase[];
  min: MaxMinValidTestCase[];
  getRawNumber: GetRawNumberValidTestCase[];
  plus: PlusMinusMultiplyDivideValidTestCase[];
  minus: PlusMinusMultiplyDivideValidTestCase[];
  multipliedBy: PlusMinusMultiplyDivideValidTestCase[];
  dividedBy: PlusMinusMultiplyDivideValidTestCase[];
  mod: ModValidTestCase[];
  pow: PowValidTestCase[];
  abs: AbsValidTestCase[];
  isNegative: ValidationValidTestCase[];
  isZero: ValidationValidTestCase[];
  isInteger: ValidationValidTestCase[];
  isGreaterThan: ComparisonValidTestCase[];
  isGreaterThanOrEqualTo: ComparisonValidTestCase[];
  isLessThan: ComparisonValidTestCase[];
  isLessThanOrEqualTo: ComparisonValidTestCase[];
  isNaN: ValidationValidTestCase[];
  isPositive: ValidationValidTestCase[];
  toNumber: ToNumberValidTestCase[];
  toString: ToStringValidTestCase[];
  toFixed: ToFixedValidTestCase[];
  toPrecision: ToPrecisionValidTestCase[];
  compareTo: CompareToValidTestCase[];
};
