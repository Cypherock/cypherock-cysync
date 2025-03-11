import { Dimensions, View } from 'react-native';
import React, { useMemo, useState } from 'react';
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
  const [maxValue, setMaxValue] = useState(
    parseFloat(summaryDetails.totalValue),
  );

  const optimizedGraphData = useMemo(() => {
    const totalValue = parseFloat(summaryDetails.totalValue);
    let maxValue = totalValue;
    const data = graphData.map((d, i) => {
      if (d.value > maxValue) {
        maxValue = d.value;
      }
      const dataPoint: FormattedGraphData = {
        value: d.value,
        dataPointLabelComponent: () => (
          <DataPointLabel>{formatTooltipValue(d)}</DataPointLabel>
        ),
        yAxisLabelTexts: formatYAxisTick(d.value),
      };
      if (i == 0 || i == graphData.length - 1) {
        dataPoint.label = formatTimestamp(d.timestamp);
      }
      return dataPoint;
    });
    setMaxValue(maxValue);
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
        maxValue={maxValue * 1.2}
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
