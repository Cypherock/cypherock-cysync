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

  private static getNumberLike(n: NumberLike) {
    if (n instanceof BigNumber) {
      return n.getRawNumber();
    }

    return n;
  }
}
