import { FC, useRef, useState } from 'react';
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

const hexToRGB = (value: string) => {
  const numericValue = parseInt(value.replace('#', ''), 16);
  // eslint-disable-next-line no-bitwise
  const r = (numericValue >> 16) & 0xff;
  // eslint-disable-next-line no-bitwise
  const g = (numericValue >> 8) & 0xff;
  // eslint-disable-next-line no-bitwise
  const b = numericValue & 0xff;
  return { r, g, b };
};

export const DisplayGraph: FC<LineChartPropsType> = ({ ...props }) => {
  const { current: colorRgb } = useRef(hexToRGB(props.color ?? 'E9B873'));
  const [labelShift, setLabelShift] = useState(0);

  const handleFocus = (_: any, x: number) => {
    if (!props.data) return;
    const shiftAmount = 150;
    if (x > props.data?.length / 2.4) {
      setLabelShift(-shiftAmount);
    } else {
      setLabelShift(0);
    }
  };

  return (
    <LineChart
      {...props}
      focusEnabled
      showStripOnFocus
      initialSpacing={1}
      endSpacing={1}
      stripHeight={156}
      stripStrokeDashArray={[5, 2]}
      showDataPointOnFocus
      dataPointsHeight={11}
      dataPointsWidth={11}
      focusedCustomDataPoint={() => <DataPointIcon />}
      showDataPointLabelOnFocus
      curved
      width={width - 48}
      height={156}
      textColor={'rgba(139, 134, 130, 1)'}
      rulesColor={colors.text.secondary}
      xAxisColor={colors.text.secondary}
      yAxisColor={'transparent'}
      dataPointsColor="transparent"
      color1={props.color}
      startFillColor={`rgba(${colorRgb.r}, ${colorRgb.g}, ${colorRgb.b}, 1)`}
      startOpacity={1}
      endFillColor={`rgba(${colorRgb.r}, ${colorRgb.g}, ${colorRgb.b}, 0)`}
      endOpacity={0}
      yAxisTextStyle={{ color: colors.text.secondary, fontSize: 10 }}
      xAxisLabelTextStyle={{ opacity: 0 }}
      disableScroll
      dataPointLabelShiftY={20}
      dataPointLabelShiftX={labelShift}
      onFocus={handleFocus}
      delayBeforeUnFocus={1000}
    />
  );
};
