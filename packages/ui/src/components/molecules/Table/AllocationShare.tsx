import React, { FC } from 'react';
import styled from 'styled-components';

import { Typography } from '../../atoms';
import { UtilsProps, utils } from '../../utils';

interface AllocationShareProps extends UtilsProps {
  percentage: number;
  color: string;
}

const AllocationShareStyle = styled.div<AllocationShareProps>`
  padding: 16px 24px 16px 16px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
  justify-content: flex-start;

  @media ${({ theme }) => theme.screens.lg} {
    padding: 16px 20px 16px 40px;
    flex-direction: row;
    align-items: center;
    gap: 0;
  }

  ${utils}
`;

const BackgroundStyle = styled.div<AllocationShareProps>`
  width: 100%;
  height: 6px;
  border-radius: 5px;
  background: ${({ theme }) => theme.palette.background.inputSecondary};

  @media ${({ theme }) => theme.screens.lg} {
    width: 160px;
  }
`;

const FillerStyle = styled.div<AllocationShareProps>`
  height: 102%;
  width: ${({ percentage }) => percentage}%;
  background: ${({ color }) => color};
  border-radius: 5px;
`;

export const AllocationShare: FC<AllocationShareProps> = ({ ...props }) => (
  <AllocationShareStyle {...props}>
    <Typography variant="p" color="muted" mr={2} $minWidth="70px">
      {props.percentage.toFixed(2)}%
    </Typography>
    <BackgroundStyle {...props}>
      <FillerStyle percentage={props.percentage} color={props.color} />
    </BackgroundStyle>
  </AllocationShareStyle>
);
