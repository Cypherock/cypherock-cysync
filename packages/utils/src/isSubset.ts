import lodash from 'lodash';

export const isSubset = (a: Record<string, any>, b: Record<string, any>) => {
  for (const key of Object.keys(a)) {
    if (!lodash.isEqual(a[key], b[key])) {
      return false;
    }
  }

  return true;
};
