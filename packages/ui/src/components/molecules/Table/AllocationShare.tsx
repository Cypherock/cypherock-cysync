import React, { FC } from 'react';
import styled from 'styled-components';

import { NameVariants } from './IconNameBox';

import { Typography } from '../../atoms';

interface AllocationShareProps {
  percentage: number;
  variant: NameVariants;
  size?: 'small' | 'big';
}

const assetColorMap: Record<NameVariants, string> = {
  Bitcoin: '#F89C2D',
  Ethereum: '#0085FF',
};

const AllocationShareStyle = styled.div<AllocationShareProps>`
  padding: ${({ size }) =>
    size === 'small' ? '16px 24px 16px 16px' : '16px 20px 16px 40px'};
  width: ${({ size }) => (size === 'small' ? '144px' : '300px')};
  display: flex;
  flex-direction: ${({ size }) => (size === 'small' ? 'column' : 'row')};
  align-items: ${({ size }) => (size === 'small' ? 'flex-start' : 'center')};
  gap: ${({ size }) => (size === 'small' ? '8px' : '0')};
  justify-content: space-between;
`;

const BackgroundStyle = styled.div<AllocationShareProps>`
  width: ${({ size }) => (size === 'small' ? '104px' : '160px')};
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

export const AllocationShare: FC<AllocationShareProps> = ({ ...props }) => (
  <AllocationShareStyle {...props}>
    <Typography variant="p" color="muted">
      {props.percentage}%
    </Typography>
    <BackgroundStyle {...props}>
      <FillerStyle percentage={props.percentage} variant={props.variant} />
    </BackgroundStyle>
  </AllocationShareStyle>
);

AllocationShare.defaultProps = {
  size: 'big',
};
