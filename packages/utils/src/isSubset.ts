import lodash from 'lodash';

export const isSubset = (a: Record<string, any>, b: Record<string, any>) =>
  Object.keys(a).every(key => lodash.isEqual(a[key], b[key]));
