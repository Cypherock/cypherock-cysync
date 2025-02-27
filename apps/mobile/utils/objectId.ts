let count = 1;

const idMap: WeakMap<Record<string, unknown> | unknown[], number> = new WeakMap<
  Record<string, unknown> | unknown[],
  number
>();

export function getObjectId(obj: Record<string, unknown> | unknown[]): number {
  const objectId: number | undefined = idMap.get(obj);
  if (objectId === undefined) {
    count += 1;
    idMap.set(obj, count);

    return count;
  }

  return objectId;
}
