import BigNumberJS from 'bignumber.js';

export type NumberLike = BigNumberJS.Value | BigNumber;

export type RoundingMode = BigNumberJS.RoundingMode;

export class BigNumber {
  private readonly num: BigNumberJS;

  static ROUND_CEIL = BigNumberJS.ROUND_CEIL;

  static ROUND_FLOOR = BigNumberJS.ROUND_FLOOR;

  constructor(n: NumberLike, base?: number) {
    this.num = new BigNumberJS(BigNumber.getNumberLike(n), base);
  }

  getRawNumber() {
    return this.num;
  }

  plus(n: NumberLike, base?: number) {
    return new BigNumber(this.num.plus(BigNumber.getNumberLike(n), base));
  }

  minus(n: NumberLike, base?: number) {
    return new BigNumber(this.num.minus(BigNumber.getNumberLike(n), base));
  }

  multipliedBy(n: NumberLike, base?: number) {
    return new BigNumber(
      this.num.multipliedBy(BigNumber.getNumberLike(n), base),
    );
  }

  dividedBy(n: NumberLike, base?: number) {
    return new BigNumber(this.num.dividedBy(BigNumber.getNumberLike(n), base));
  }

  mod(n: NumberLike, base?: number) {
    return new BigNumber(this.num.mod(BigNumber.getNumberLike(n), base));
  }

  modulo(n: NumberLike, base?: number) {
    return new BigNumber(this.num.modulo(BigNumber.getNumberLike(n), base));
  }

  pow(n: NumberLike, base?: number) {
    return new BigNumber(this.num.pow(BigNumber.getNumberLike(n), base));
  }

  abs() {
    return new BigNumber(this.num.abs());
  }

  isNegative() {
    return this.num.isNegative();
  }

  isZero() {
    return this.num.isZero();
  }

  isGreaterThan(n: NumberLike, base?: number) {
    return this.num.isGreaterThan(BigNumber.getNumberLike(n), base);
  }

  isGreaterThanOrEqualTo(n: NumberLike, base?: number) {
    return this.num.isGreaterThanOrEqualTo(BigNumber.getNumberLike(n), base);
  }

  isLessThan(n: NumberLike, base?: number) {
    return this.num.isLessThan(BigNumber.getNumberLike(n), base);
  }

  isLessThanOrEqualTo(n: NumberLike, base?: number) {
    return this.num.isLessThanOrEqualTo(BigNumber.getNumberLike(n), base);
  }

  isNaN() {
    return this.num.isNaN();
  }

  isPositive() {
    return this.num.isPositive();
  }

  toNumber() {
    return this.num.toNumber();
  }

  toString(base?: number) {
    return this.num.toString(base);
  }

  toFixed(decimalPlaces: number, roundingMode?: RoundingMode) {
    return this.num.toFixed(decimalPlaces, roundingMode);
  }

  toPrecision(decimalPlaces: number, roundingMode?: RoundingMode) {
    return this.num.toPrecision(decimalPlaces, roundingMode);
  }

  compareTo(n: NumberLike) {
    return this.num.comparedTo(new BigNumberJS(BigNumber.getNumberLike(n)));
  }

  private static getNumberLike(n: NumberLike) {
    if (n instanceof BigNumber) {
      return n.getRawNumber();
    }

    return n;
  }
}
