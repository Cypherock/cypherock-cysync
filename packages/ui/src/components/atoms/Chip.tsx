import React, { FC } from 'react';
import styled from 'styled-components';

import { FontProps, SpacingProps, font, spacing } from '../utils';

interface ChipProps extends SpacingProps, FontProps {
  children: React.ReactNode;
}

const ChipStyle = styled.div`
  display: flex;
  padding: 1px 6px;
  gap: var(--0-px, 0px);
  align-items: flex-start;
  border-radius: 29px;
  border: 1px solid ${({ theme }) => theme.palette.border.muted};
  ${spacing}
  ${font}
`;

export const Chip: FC<ChipProps> = ({ children, ...props }) => (
  <ChipStyle {...props}>{children}</ChipStyle>
);
