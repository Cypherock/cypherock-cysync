import { IPriceSnapshot } from '@cypherock/db-interfaces';

interface INumericPricePoint {
  timestamp: number;
  price: number;
}

/**
 * Linearly interpolated price at `timestamp` from points sorted ascending by
 * timestamp. Timestamps outside the covered span are clamped to the nearest
 * edge value.
 */
const interpolatePriceAt = (
  sortedPoints: INumericPricePoint[],
  timestamp: number,
): number => {
  const first = sortedPoints[0];
  const last = sortedPoints[sortedPoints.length - 1];

  if (timestamp <= first.timestamp) return first.price;
  if (timestamp >= last.timestamp) return last.price;

  let lo = 0;
  let hi = sortedPoints.length - 1;

  while (lo + 1 < hi) {
    const mid = (lo + hi) >>> 1;
    if (sortedPoints[mid].timestamp <= timestamp) lo = mid;
    else hi = mid;
  }

  const left = sortedPoints[lo];
  const right = sortedPoints[hi];
  const span = right.timestamp - left.timestamp;

  if (span === 0) return left.price;

  const slope = (right.price - left.price) / span;
  return left.price + slope * (timestamp - left.timestamp);
};

/**
 * Downsamples a raw `[timestamp, price][]` series (as returned by the price
 * history API) to at most `maxPoints` evenly spaced points, linearly
 * interpolating prices at the resampled timestamps. The first and last raw
 * points are always preserved exactly. Series that already fit within
 * `maxPoints` are returned unchanged.
 */
export const downsamplePricePairs = (
  pairs: number[][],
  maxPoints: number,
): number[][] => {
  if (maxPoints < 2 || pairs.length <= maxPoints) return pairs;

  const sorted = [...pairs].sort((a, b) => a[0] - b[0]);
  const points: INumericPricePoint[] = sorted.map(pair => ({
    timestamp: pair[0],
    price: pair[1],
  }));

  const start = points[0].timestamp;
  const end = points[points.length - 1].timestamp;
  const step = (end - start) / (maxPoints - 1);

  const result: number[][] = [];
  for (let i = 0; i < maxPoints; i += 1) {
    if (i === 0) {
      result.push([start, points[0].price]);
    } else if (i === maxPoints - 1) {
      result.push([end, points[points.length - 1].price]);
    } else {
      const timestamp = Math.round(start + i * step);
      result.push([timestamp, interpolatePriceAt(points, timestamp)]);
    }
  }

  return result;
};

/**
 * Resamples stored price snapshots onto `count` evenly spaced timestamps
 * ending at `endTime` and spanning `windowInMs`. Prices are linearly
 * interpolated from the given history; timestamps more than one resample
 * step before the first known snapshot resolve to price '0' (the coin had
 * no recorded price yet), matching the legacy zero-padding behavior. The
 * one-step tolerance avoids a spurious zero at the window edge when the
 * stored series covers marginally less than the full window.
 */
export const resamplePriceSnapshots = (params: {
  history: IPriceSnapshot[];
  endTime: number;
  windowInMs: number;
  count: number;
}): IPriceSnapshot[] => {
  const { history, endTime, windowInMs, count } = params;

  const points: INumericPricePoint[] = history
    .map(snapshot => ({
      timestamp: snapshot.timestamp,
      price: Number(snapshot.price),
    }))
    .sort((a, b) => a.timestamp - b.timestamp);

  if (count < 2) {
    const price =
      points.length > 0 ? points[points.length - 1].price.toString() : '0';
    return [{ timestamp: endTime, price }];
  }

  const startTime = endTime - windowInMs;
  const step = windowInMs / (count - 1);
  const firstKnown = points[0]?.timestamp;

  const result: IPriceSnapshot[] = [];
  for (let i = 0; i < count; i += 1) {
    const timestamp =
      i === count - 1 ? endTime : Math.round(startTime + i * step);

    let price = '0';
    if (points.length > 0 && firstKnown - timestamp <= step) {
      price = interpolatePriceAt(points, timestamp).toString();
    }

    result.push({ timestamp, price });
  }

  return result;
};
