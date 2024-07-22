import { useMemo, useState } from 'react';

import { selectLanguage, useAppSelector } from '..';

export const GraphTimeRangeMap = {
  day: 'day',
  week: 'week',
  month: 'month',
  year: 'year',
} as const;

export const graphTimeRangeToDaysMap: Record<GraphTimeRange, 1 | 7 | 30 | 365> =
  {
    day: 1,
    week: 7,
    month: 30,
    year: 365,
  };

export type GraphTimeRange =
  (typeof GraphTimeRangeMap)[keyof typeof GraphTimeRangeMap];

export const useGraphTimeRange = () => {
  const [selectedRange, setSelectedRange] = useState<GraphTimeRange>(
    GraphTimeRangeMap.month,
  );
  const lang = useAppSelector(selectLanguage);

  const rangeList: { text: string; id: string }[] = useMemo(
    () => [
      {
        text: lang.strings.graph.timeRange.day,
        id: GraphTimeRangeMap.day,
      },
      {
        text: lang.strings.graph.timeRange.week,
        id: GraphTimeRangeMap.week,
      },
      {
        text: lang.strings.graph.timeRange.month,
        id: GraphTimeRangeMap.month,
      },
      {
        text: lang.strings.graph.timeRange.year,
        id: GraphTimeRangeMap.year,
      },
    ],
    [lang],
  );

  return {
    selectedRange,
    setSelectedRange,
    rangeList,
  };
};
