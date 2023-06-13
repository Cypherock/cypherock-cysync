import lodash from 'lodash';

export function isSubsetOf(filter: any, entity: any) {
  return lodash.every(filter, (val, key) =>
    lodash.isEqual(val, (entity as any)[key]),
  );
}
