import React, { FC } from 'react';
import styled from 'styled-components';

import { NameVariants } from './IconNameBox';

import { Typography } from '../../atoms';

interface AllocationShareProps {
  percentage: number;
  variant: NameVariants;
}

const assetColorMap: Record<NameVariants, string> = {
  Bitcoin: '#F89C2D',
  Ethereum: '#0085FF',
};

const AllocationShareStyle = styled.div`
  padding: 16px 20px 16px 40px;
  width: 300px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const BackgroundStyle = styled.div`
  width: 160px;
  height: 6px;
  border-radius: 5px;
  background: ${({ theme }) => theme.palette.background.inputSecondary};
`;
const FillerStyle = styled.div<AllocationShareProps>`
  height: 102%;
  width: ${({ percentage }) => percentage}%;
  background: ${({ variant }) => assetColorMap[variant]};
  border-radius: 5px;
`;

export const AllocationShare: FC<AllocationShareProps> = ({
  percentage,
  variant,
}) => (
  <AllocationShareStyle>
    <Typography variant="p" color="muted">
      {percentage}%
    </Typography>
    <BackgroundStyle>
      <FillerStyle percentage={percentage} variant={variant} />
    </BackgroundStyle>
  </AllocationShareStyle>
);
