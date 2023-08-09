import React, { FC } from 'react';
import styled from 'styled-components';

import { Typography } from '../../atoms';

interface AllocationShareProps {
  percentage: number;
  color: string;
}

const AllocationShareStyle = styled.div<AllocationShareProps>`
  padding: 16px 24px 16px 16px;
  width: 144px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
  justify-content: space-between;

  @media ${({ theme }) => theme.screens.lg} {
    padding: 16px 20px 16px 40px;
    width: 300px;
    flex-direction: row;
    align-items: center;
    gap: 0;
  }
`;

const BackgroundStyle = styled.div<AllocationShareProps>`
  width: 104px;
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
    <Typography variant="p" color="muted">
      {props.percentage}%
    </Typography>
    <BackgroundStyle {...props}>
      <FillerStyle percentage={props.percentage} color={props.color} />
    </BackgroundStyle>
  </AllocationShareStyle>
);
