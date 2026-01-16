import { Dimensions, View } from 'react-native';
import React, { useMemo, useRef } from 'react';
import { DisplayGraph, Flex, Loader, Seperator, Typography } from '../ui';
import { useGraph, UseGraphProps } from '@/hooks';

export interface GraphPropTypes extends UseGraphProps {
  color?: string;
}

export interface FormattedGraphData {
  label?: string;
  value: number;
  dataPointLabelContent: string[];
  yAxisLabelTexts: string;
}

const width = Dimensions.get('window').width;

export const Graph = (props: GraphPropTypes) => {
  const {
    summaryDetails,
    graphData,
    formatGraphAmountDisplay,
    formatTooltipValue,
    formatTimestamp,
    formatYAxisTick,
    isLoading,
  } = useGraph(props);
  const { BtcIdMap, coinList } = require('@cypherock/coins');
  const maxValueRef = useRef(0);
  const minValueRef = useRef(0);
  const widthRef = useRef(width - 24);

  function getLastPointOffset() {
    switch (props.selectedRange) {
      case 'day':
        return 3;

      case 'week':
        return 15;

      case 'month':
        return 3;

      case 'year':
        return 40;

      default:
        return 0;
    }
  }

  const optimizedGraphData = useMemo(() => {
    const values = graphData.map(d => d.value).filter(v => Number.isFinite(v));
    if (values.length === 0) {
      maxValueRef.current = 0;
      minValueRef.current = 0;
      return [];
    }

    let minValue = Math.min(...values);
    let maxValue = Math.max(...values);
    const range = maxValue - minValue;
    const padding =
      range === 0 ? Math.max(Math.abs(maxValue) * 0.05, 1) : range * 0.1;

    minValue -= padding;
    maxValue += padding;

    minValueRef.current = minValue;
    maxValueRef.current = Math.max(maxValue - minValue, 0);

    const data = graphData.map((d, i) => {
      const scaledValue = d.value - minValue;
      const dataPoint: FormattedGraphData = {
        value: scaledValue,
        dataPointLabelContent: formatTooltipValue(d),
        yAxisLabelTexts: formatYAxisTick(d.value),
      };

      const interval = Math.floor(graphData.length / 3);
      if (graphData.length > 0) {
        const LAST_POINT_OFFSET = getLastPointOffset();
        const isFirstPoint = i === 0;
        const isLastPoint = i === graphData.length - LAST_POINT_OFFSET;
        const isQuarterPoint = i === Math.floor(interval);
        const isMiddlePoint = i === Math.floor(interval * 2);

        if (isFirstPoint || isLastPoint || isQuarterPoint || isMiddlePoint) {
          dataPoint.label = formatTimestamp(
            isLastPoint
              ? graphData[graphData.length - 1].timestamp
              : d.timestamp,
          );
        }
      }
      return dataPoint;
    });
    return data;
  }, [graphData, formatTimestamp, formatTooltipValue, formatYAxisTick]);

  const totalValueDisplay =
    summaryDetails.totalValue !== ''
      ? summaryDetails.totalValue
      : formatGraphAmountDisplay(0, true, true);

  const changeValueDisplay =
    summaryDetails.changeValue !== ''
      ? summaryDetails.changeValue
      : formatGraphAmountDisplay(0, true, true);

  if (isLoading) {
    return (
      <View style={{ justifyContent: 'center', flex: 1 }}>
        <Loader />
      </View>
    );
  }

  return (
    <>
      <Flex justifyContent="space-between">
        <Typography type="h3">{totalValueDisplay}</Typography>
        <Flex gap={8}>
          {summaryDetails.changeIcon}
          <Typography type="h5" color={'secondary'}>
            {summaryDetails.changePercent}
          </Typography>
          <Seperator type="v" />
          <Typography type="h5" color={'secondary'}>
            {changeValueDisplay}
          </Typography>
        </Flex>
      </Flex>
      <DisplayGraph
        data={optimizedGraphData}
        maxValue={maxValueRef.current}
        height={170}
        width={widthRef.current - 40}
        formatYLabel={value =>
          formatYAxisTick(Number(value) + minValueRef.current)
        }
        hideOrigin={false}
        color={props.color ?? coinList[BtcIdMap.bitcoin].color}
      />
    </>
  );
};
