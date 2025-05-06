import React, { FC } from 'react';
import styled from 'styled-components';

import {
  FontProps,
  SpacingProps,
  font,
  silverGradient,
  spacing,
  goldenGradient,
} from '../utils';

type GradientType = 'silver' | 'golden';

interface ChipProps extends SpacingProps, FontProps {
  children: React.ReactNode;
  $gradient?: GradientType;
}

const gradientMap: Record<GradientType, any> = {
  silver: silverGradient('background'),
  golden: goldenGradient('background'),
};

const ChipStyle = styled.div<ChipProps>`
  display: flex;
  padding: 1px 6px;
  gap: var(--0-px, 0px);
  align-items: flex-start;
  border-radius: 29px;
  border: 1px solid
    ${({ theme, $gradient }) =>
      $gradient !== 'golden' && theme.palette.border.muted};
  ${spacing}
  ${font}
  ${({ $gradient }) => $gradient && gradientMap[$gradient]}
`;

export const Chip: FC<ChipProps> = ({ children, ...props }) => (
  <ChipStyle {...props}>{children}</ChipStyle>
);

Chip.defaultProps = {
  $gradient: undefined,
};
