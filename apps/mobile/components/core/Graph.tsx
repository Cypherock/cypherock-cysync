import { Dimensions } from 'react-native';
import React, { useEffect, useMemo, useState } from 'react';
import {
  DataPointLabel,
  DisplayGraph,
  Flex,
  Seperator,
  Typography,
} from '../ui';
import { BtcIdMap, coinList } from '@cypherock/coins';
import { useGraph, UseGraphProps } from '@/hooks';

export interface GraphPropTypes extends UseGraphProps {}

export const Graph = (props: GraphPropTypes) => {
  const {
    summaryDetails,
    graphData,
    formatGraphAmountDisplay,
    formatTooltipValue,
    formatTimestamp,
    formatYAxisTick,
  } = useGraph(props);

  const [optimizedGraphData, setOptimizedGraphData] = useState<
    {
      label?: string;
      value: number;
      dataPointLabelComponent: () => React.JSX.Element;
      yAxisLabelTexts: string;
    }[]
  >([]);

  const formatGraphData = useMemo(() => {
    return graphData.map(d => {
      return {
        label: formatTimestamp(d.timestamp),
        value: d.value,
        dataPointLabelComponent: () => (
          <DataPointLabel>{formatTooltipValue(d)}</DataPointLabel>
        ),
        yAxisLabelTexts: formatYAxisTick(d.value),
      };
    });
  }, [graphData]);

  useEffect(() => {
    setOptimizedGraphData(formatGraphData);
  }, [graphData]);

  if (graphData.length === 0) {
    return null;
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
