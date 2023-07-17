import { SVGProps } from 'react';
import styled from 'styled-components';

import {
  spacing,
  animate,
  SpacingProps,
  AnimateProps,
  FlexProps,
  flex,
  TransformProps,
  transform,
  PositionProps,
  position,
} from '../../components/utils';

export type SvgProps = SpacingProps &
  AnimateProps &
  TransformProps &
  PositionProps &
  FlexProps &
  SVGProps<SVGSVGElement>;

export const SvgStyle = styled.svg<SvgProps>`
  ${spacing}
  ${animate}
  ${transform}
  ${position}
  ${flex}
`;
