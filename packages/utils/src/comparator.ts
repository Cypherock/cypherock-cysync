import { BigNumber } from './bigNumber';

export const createComparator =
  (key: string, type: 'string' | 'number') => (a: any, b: any) => {
    if (a === undefined || b === undefined) {
      throw new Error('undefined is not allowed in comparator parameters');
    }

    if (a === null || b === null) {
      throw new Error('null is not allowed in comparator parameters');
    }

    if (Array.isArray(a) || Array.isArray(b)) {
      throw new Error('array is not allowed in comparator parameters');
    }

    if (a instanceof Set || b instanceof Set) {
      throw new Error('set is not allowed in comparator parameters');
    }

    if (!(key in a) || !(key in b)) {
      throw new Error(`Key '${key}' not found in objects`);
    }

    const firstValue = a[key] as string | number;
    const secondValue = b[key] as string | number;

    let result = 0;
    if (type === 'string') {
      result = (secondValue as string).localeCompare(firstValue as string);
    } else {
      result = new BigNumber(secondValue).compareTo(firstValue);
    }

    return result;
  };
