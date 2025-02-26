import { Dimensions, View } from 'react-native';
import React, { useMemo } from 'react';
import {
  DataPointLabel,
  DisplayGraph,
  Flex,
  Loader,
  Seperator,
  Typography,
} from '../ui';
import { BtcIdMap, coinList } from '@cypherock/coins';
import { useGraph, UseGraphProps } from '@/hooks';

export interface GraphPropTypes extends UseGraphProps {}

interface FormattedGraphData {
  label?: string;
  value: number;
  dataPointLabelComponent: () => React.JSX.Element;
  yAxisLabelTexts: string;
}

const MAX_GRAPH_POINTS = 200;

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

  /**Needs further optimization */
  const optimizedGraphData = useMemo(() => {
    const selectedGraphData =
      graphData.length > MAX_GRAPH_POINTS
        ? (() => {
            const step = (graphData.length - 1) / (MAX_GRAPH_POINTS - 1);
            return Array.from({ length: MAX_GRAPH_POINTS }, (_, i) => {
              const index = Math.round(i * step);
              return graphData[index];
            });
          })()
        : graphData;

    const MAX_LABELS = 5;
    const labelIndexes = new Set<number>();
    for (let i = 0; i < MAX_LABELS; i++) {
      const index = Math.round(
        (i * (selectedGraphData.length - 1)) / (MAX_LABELS - 1),
      );
      labelIndexes.add(index);
    }

    const data = selectedGraphData.map((d, i) => {
      const dataPoint: FormattedGraphData = {
        value: d.value,
        dataPointLabelComponent: () => (
          <DataPointLabel>{formatTooltipValue(d)}</DataPointLabel>
        ),
        yAxisLabelTexts: formatYAxisTick(d.value),
      };
      if (labelIndexes.has(i)) {
        dataPoint.label = formatTimestamp(d.timestamp);
      }
      return dataPoint;
    });
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
        areaChart
        spacing={Dimensions.get('screen').width / optimizedGraphData.length}
        data={optimizedGraphData}
        maxValue={parseFloat(summaryDetails.totalValue) * 1.8}
        hideYAxisText
        color={
          props.parentAssetId
            ? coinList[props.parentAssetId].color
            : coinList[BtcIdMap.bitcoin].color
        }
      />
    </>
  );
};
