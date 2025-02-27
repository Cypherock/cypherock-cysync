import lodash from 'lodash';

import { getObjectId } from './objectId';

export function memoizeFunctionWithObjectArg<T extends (arg: any) => any>(
  func: T,
) {
  return lodash.memoize(func, params => {
    let id = '';

    for (const val of Object.values(params)) {
      if (val === undefined || val === null) {
        id += 'null-';
      } else if (typeof val === 'object') {
        id += `${getObjectId(val as any)}-`;
      } else {
        id += `${val}-`;
      }
    }

    return id;
  });
}
