import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

import { DashedLineGold, GraphPoint } from '../../../../assets';
import { Container, Bullet } from '../../../atoms';
import { UtilsProps, utils } from '../../../utils';

const TooltipContainer = styled.div<UtilsProps>`
  background: ${({ theme }) => theme.palette.border.popup};
  font-size: 14px;
  font-weight: 400;
  color: ${({ theme }) => theme.palette.text.white};

  padding: 4px 8px;
  border-radius: 8px;
  opacity: 1;

  pointer-events: none;
  position: absolute;
  transition: all 0.1s ease;
  white-space: nowrap;
  word-break: keep-all;

  display: flex;
  gap: 8px;

  ${utils}
`;

const TooltipLine = styled.div<UtilsProps>`
  pointer-events: none;
  position: absolute;
  transform: translate(-50%, 0);
  transition: all 0.1s ease;

  ${utils}
`;

const TooltipDot = styled.div<UtilsProps>`
  pointer-events: none;
  position: absolute;
  transition: all 0.1s ease;
  width: 10px;
  height: 10px;
  transform: translate(-50%, -50%);

  ${utils}
`;

export interface LineGraphTooltipState {
  values: string[];
  isVisible: boolean;
  pointX: number;
  pointY: number;
  chartWidth: number;
  chartHeight: number;
  chartTop: number;
  chartLeft: number;
  chartPadding: number;
}

export interface LineGraphTooltipProps {
  getUpdateMethod: (func: (state: LineGraphTooltipState) => void) => void;
}

export const LineGraphTooltip: React.FC<LineGraphTooltipProps> = ({
  getUpdateMethod,
}) => {
  const tooltipElementRef = useRef<HTMLDivElement | null>(null);
  const [state, setState] = useState<LineGraphTooltipState>({
    values: [],
    chartPadding: 0,
    isVisible: false,
    pointX: 0,
    pointY: 0,
    chartWidth: 0,
    chartHeight: 0,
    chartTop: 0,
    chartLeft: 0,
  });

  const { values } = state;

  useEffect(() => {
    getUpdateMethod(setState);
  }, []);

  let leftPosition: number | undefined = state.pointX;
  let rightPosition: number | undefined;
  const topPosition = state.pointY;

  const tooltipWidth = tooltipElementRef.current?.clientWidth;
  const chartPadding = 40;

  if (
    tooltipWidth &&
    leftPosition + tooltipWidth + chartPadding > state.chartWidth
  ) {
    rightPosition = state.chartWidth - leftPosition;
    leftPosition = undefined;
  }

  return (
    <>
      <TooltipLine
        left={`${state.pointX}px`}
        top={50}
        height={`${state.chartHeight - 80}px`}
        opacity={state.isVisible ? 1 : 0}
      >
        <DashedLineGold width="100%" height="100%" />
      </TooltipLine>
      <TooltipDot
        left={`${state.pointX}px`}
        top={`${state.pointY}px`}
        opacity={state.isVisible ? 1 : 0}
      >
        <GraphPoint
          width="100%"
          height="100%"
          position="absolute"
          top={0}
          left={0}
        />
      </TooltipDot>
      <TooltipContainer
        ref={tooltipElementRef}
        opacity={state.isVisible ? 1 : 0}
        left={`${leftPosition}px`}
        top={`${topPosition}px`}
        right={`${rightPosition}px`}
        $translateX={leftPosition ? 8 : -8}
      >
        {values.map(value => (
          <Container key={value}>
            <Bullet variant="gold" size="sm" mr={1} />
            <div>{value}</div>
          </Container>
        ))}
      </TooltipContainer>
    </>
  );
};

LineGraphTooltip.displayName = 'LineGraphTooltip';
