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
  const maxValueRef = useRef(parseFloat(summaryDetails.totalValue));
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
    const totalValue = parseFloat(summaryDetails.totalValue);
    let maxValue = totalValue;
    const data = graphData.map((d, i) => {
      if (d.value > maxValue) {
        maxValue = d.value;
      }

      const dataPoint: FormattedGraphData = {
        value: d.value,
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
    maxValueRef.current = maxValue;
    return data;
  }, [graphData, formatTimestamp, formatTooltipValue, formatYAxisTick]);

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
        <Typography type="h3">
          {formatGraphAmountDisplay(summaryDetails.totalValue, true, true)}
        </Typography>
        <Flex gap={8}>
          {summaryDetails.changeIcon}
          <Typography type="h5" color={'secondary'}>
            {summaryDetails.changePercent}
          </Typography>
          <Seperator type="v" />
          <Typography type="h5" color={'secondary'}>
            {formatGraphAmountDisplay(summaryDetails.changeValue, true, true)}
          </Typography>
        </Flex>
      </Flex>
      <DisplayGraph
        data={optimizedGraphData}
        maxValue={maxValueRef.current * 1.2}
        height={170}
        width={widthRef.current - 40}
        formatYLabel={formatYAxisTick}
        color={props.color ?? coinList[BtcIdMap.bitcoin].color}
      />
    </>
  );
};
