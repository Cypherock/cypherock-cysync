import styled from 'styled-components';

import { BorderProps, SpacingProps, border, font, spacing } from '../utils';

interface VerticalLineProps extends BorderProps, SpacingProps {
  height?: number;
}

export const VerticalLine = styled.div<VerticalLineProps>`
  width: 10px;
  display: inline;
  height: ${props => (props.height ? `${props.height}px` : '100%')};
  color: ${({ theme }) => theme.palette.background.white};
  background-color: ${({ theme }) => theme.palette.border.white};
  ${border}
  ${font}
  ${spacing}
`;

export default VerticalLine;
