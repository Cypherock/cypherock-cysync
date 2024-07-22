import React from 'react';
import styled from 'styled-components';

import { UtilsProps, utils } from '../utils';

type FloatDirection = 'left' | 'right';

export interface FloatProps extends UtilsProps {
  children: React.ReactNode;
  $floatDirection: FloatDirection;
}

export const FloatContainer = styled.span<{ $floatDirection: FloatDirection }>`
  float: ${props => props.$floatDirection};
  ${utils}
`;
