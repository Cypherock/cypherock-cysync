import { FC, useRef, useState } from 'react';
import { LineChart, LineChartPropsType } from 'react-native-gifted-charts';
import { colors } from '../themes/color.styled';
import styled from 'styled-components/native';
import { DataPointIcon } from '../icons';
import { FormattedGraphData } from '@/components/core';
import { useTheme } from '../themes';

export const DataPointCircle = styled.View`
  width: 6px;
  height: 6px;
  min-width: 6px;
  min-height: 6px;

  border-radius: 10px;
  background-color: ${({ theme }) => theme.palette.accent};
`;

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

  width: 148px;

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
  const theme = useTheme();
  const { current: colorRgb } = useRef(hexToRGB(props.color ?? 'E9B873'));

  const [labelShift, setLabelShift] = useState(20);

  const handleFocus = (x: number) => {
    if (!props.data) return;
    const shiftAmount = 140;
    if (x > props.data?.length / 2.4) {
      setLabelShift(-shiftAmount);
    } else {
      setLabelShift(20);
    }
  };

  return (
    <LineChart
      {...props}
      areaChart
      hideOrigin
      initialSpacing={5}
      endSpacing={5}
      curved
      pointerConfig={{
        pointerStripColor: theme.palette.accent,
        showPointerStrip: true,
        strokeDashArray: [5, 6],
        dynamicLegendContainerStyle: () => {},
        pointerComponent: () => <DataPointIcon />,
        shiftPointerLabelX: labelShift,
        pointerLabelComponent: (
          items: FormattedGraphData[],
          _: any,
          pointerIndex: number,
        ) => {
          handleFocus(pointerIndex);
          return (
            <DataPointLabel>
              <DataPointCircle /> {items[0].dataPointLabelContent[0]}
              {`\n`}
              <DataPointCircle /> {items[0].dataPointLabelContent[1]}
            </DataPointLabel>
          );
        },
      }}
      width={props.width}
      adjustToWidth
      height={props.height}
      rulesColor={colors.text.secondary}
      xAxisColor={colors.text.secondary}
      yAxisColor={'transparent'}
      hideDataPoints
      color1={props.color}
      startFillColor={`rgba(${colorRgb.r}, ${colorRgb.g}, ${colorRgb.b}, 1)`}
      startOpacity={1}
      endFillColor={`rgba(${colorRgb.r}, ${colorRgb.g}, ${colorRgb.b}, 0)`}
      endOpacity={0}
      noOfSections={5}
      yAxisTextStyle={{
        color: colors.text.secondary,
        fontSize: theme.typography.fontSize.xs,
      }}
      xAxisLabelTextStyle={{
        width: 40,
        color: colors.text.secondary,
        fontSize: theme.typography.fontSize.xs,
        textAlign: 'left',
      }}
      disableScroll
    />
  );
};
