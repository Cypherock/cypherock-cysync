import { FC } from 'react';
import { LineChart, LineChartPropsType } from 'react-native-gifted-charts';
import { colors } from '../themes/color.styled';
import { Dimensions } from 'react-native';
import styled from 'styled-components/native';
import { DataPointIcon } from '../icons';

const width = Dimensions.get('screen').width;

export const DataPointLabel = styled.Text`
  font-size: ${({ theme }) => theme.typography.body.label.fontSize}px;
  font-weight: 400;
  color: ${({ theme }) => theme.palette.text.primary};

  flex-wrap: nowrap;

  padding: 4px 8px;
  border-radius: 8px;
  opacity: 1;

  pointer-events: none;
  position: absolute;
  transition: all 0.1s ease;
  white-space: nowrap;
  word-break: keep-all;

  gap: 8px;

  background: ${({ theme }) => theme.palette.background.secondary};
`;

export const Graph: FC<LineChartPropsType> = ({ ...props }) => {
  return (
    <LineChart
      {...props}
      focusEnabled
      showStripOnFocus
      stripHeight={156}
      stripStrokeDashArray={[5, 2]}
      showDataPointOnFocus
      dataPointsHeight={11}
      dataPointsWidth={11}
      focusedCustomDataPoint={() => <DataPointIcon />}
      showDataPointLabelOnFocus
      curved
      width={width - 80}
      height={156}
      textColor={'rgba(139, 134, 130, 1)'}
      rulesColor={colors.text.secondary}
      xAxisColor={colors.text.secondary}
      yAxisColor={'transparent'}
      dataPointsColor="transparent"
      color1="#E9B873"
      startFillColor="#FFAC0A"
      startOpacity={1}
      endFillColor="rgba(40, 37, 37, 0.00)"
      endOpacity={0}
      yAxisTextStyle={{ color: colors.text.secondary, fontSize: 10 }}
      xAxisLabelTextStyle={{ color: colors.text.secondary, fontSize: 10 }}
    />
  );
};
