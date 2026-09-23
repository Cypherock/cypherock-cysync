import {
  downsamplePricePairs,
  resamplePriceSnapshots,
} from '../src/utils/resamplePriceHistory';

const HOUR = 60 * 60 * 1000;
const DAY = 24 * HOUR;

describe('downsamplePricePairs', () => {
  it('returns the series unchanged when it already fits', () => {
    const pairs = [
      [0, 10],
      [HOUR, 20],
      [2 * HOUR, 30],
    ];

    expect(downsamplePricePairs(pairs, 50)).toBe(pairs);
  });

  it('downsamples a dense series to the requested size', () => {
    // 721 hourly points over 30 days with linearly increasing price.
    const pairs = new Array(721)
      .fill(0)
      .map((_, i) => [i * HOUR, i * 2] as number[]);

    const result = downsamplePricePairs(pairs, 50);

    expect(result).toHaveLength(50);
    // First and last raw points preserved exactly.
    expect(result[0]).toEqual([0, 0]);
    expect(result[49]).toEqual([720 * HOUR, 1440]);
    // Evenly spaced timestamps.
    const step = (720 * HOUR) / 49;
    result.forEach((point, i) => {
      if (i < 49) expect(point[0]).toBe(Math.round(i * step));
      // Linear source data → interpolated price matches the line price/ms.
      expect(point[1]).toBeCloseTo((point[0] * 2) / HOUR, 6);
    });
  });

  it('interpolates prices between surrounding points', () => {
    const pairs = [
      [0, 100],
      [10, 100],
      [20, 200],
      [30, 200],
    ];

    const result = downsamplePricePairs(pairs, 3);

    expect(result).toHaveLength(3);
    expect(result[0]).toEqual([0, 100]);
    // Midpoint t=15 sits halfway between (10, 100) and (20, 200).
    expect(result[1]).toEqual([15, 150]);
    expect(result[2]).toEqual([30, 200]);
  });
});

describe('resamplePriceSnapshots', () => {
  it('produces evenly spaced points over the requested window', () => {
    const history = new Array(721).fill(0).map((_, i) => ({
      timestamp: i * HOUR,
      price: String(i),
    }));

    const result = resamplePriceSnapshots({
      history,
      endTime: 720 * HOUR,
      windowInMs: 30 * DAY,
      count: 50,
    });

    expect(result).toHaveLength(50);
    expect(result[0].timestamp).toBe(0);
    expect(result[49].timestamp).toBe(720 * HOUR);
    expect(Number(result[49].price)).toBe(720);
    // Ascending, evenly spaced.
    for (let i = 1; i < result.length; i += 1) {
      expect(result[i].timestamp).toBeGreaterThan(result[i - 1].timestamp);
    }
  });

  it('interpolates a narrow window from a sparse series', () => {
    // Two points a day apart; resample the last 6 hours (1-day-style view).
    const history = [
      { timestamp: 0, price: '0' },
      { timestamp: DAY, price: '240' },
    ];

    const result = resamplePriceSnapshots({
      history,
      endTime: DAY,
      windowInMs: 6 * HOUR,
      count: 4,
    });

    expect(result).toHaveLength(4);
    // Window is [18h, 24h]; source line is price = 10/h.
    expect(Number(result[0].price)).toBeCloseTo(180, 6);
    expect(Number(result[3].price)).toBeCloseTo(240, 6);
  });

  it('fills timestamps before the first known snapshot with zero', () => {
    const history = [
      { timestamp: 20 * DAY, price: '100' },
      { timestamp: 30 * DAY, price: '200' },
    ];

    const result = resamplePriceSnapshots({
      history,
      endTime: 30 * DAY,
      windowInMs: 30 * DAY,
      count: 31,
    });

    // Step is 1 day; anything more than one step before the first known
    // snapshot is zero-filled, while the point adjacent to it clamps to
    // the first known price (avoids a spurious zero at the window edge).
    const beforeFirst = result.filter(p => p.timestamp < 19 * DAY);
    expect(beforeFirst.length).toBeGreaterThan(0);
    beforeFirst.forEach(p => expect(p.price).toBe('0'));

    const boundary = result.find(p => p.timestamp === 19 * DAY);
    expect(boundary?.price).toBe('100');

    const after = result.filter(p => p.timestamp >= 20 * DAY);
    after.forEach(p => expect(Number(p.price)).toBeGreaterThanOrEqual(100));
  });

  it('returns an all-zero series when there is no history', () => {
    const result = resamplePriceSnapshots({
      history: [],
      endTime: 30 * DAY,
      windowInMs: 30 * DAY,
      count: 10,
    });

    expect(result).toHaveLength(10);
    result.forEach(p => expect(p.price).toBe('0'));
  });
});
