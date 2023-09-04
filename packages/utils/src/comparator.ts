import { BigNumber } from './bigNumber';

export const createComparator =
  (key: string, type: 'string' | 'number') => (a: any, b: any) => {
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
