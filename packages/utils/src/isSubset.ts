import lodash from 'lodash';

export const isSubset = (
  subset: Record<string, any>,
  superSet: Record<string, any>,
) => lodash.isMatch(superSet, subset);
