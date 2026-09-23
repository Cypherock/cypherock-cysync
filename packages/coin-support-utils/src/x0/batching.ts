/** Card limit: maximum derivation paths per deriveKeys call. */
export const X0_MAX_DERIVE_PATHS_PER_CALL = 5;
/** Card limit: maximum digests per signHashes call. */
export const X0_MAX_HASHES_PER_CALL = 8;

export function chunkArray<T>(items: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < items.length; i += size) {
    chunks.push(items.slice(i, i + size));
  }
  return chunks;
}

/**
 * signHashes accepts a single leaf path per call, so signing flows group
 * their digests by path before talking to the card. First-seen order.
 */
export function groupByLeafPath<T>(
  items: T[],
  getPath: (item: T) => number[],
): { path: number[]; items: T[] }[] {
  const groups = new Map<string, { path: number[]; items: T[] }>();

  for (const item of items) {
    const path = getPath(item);
    const key = path.join('/');
    const group = groups.get(key);
    if (group) group.items.push(item);
    else groups.set(key, { path, items: [item] });
  }

  return Array.from(groups.values());
}
