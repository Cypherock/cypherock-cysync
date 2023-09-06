import { SVGProps } from 'react';
import styled from 'styled-components';

import { flex, utils, UtilsProps } from '../../components/utils';

export type SvgProps = UtilsProps & SVGProps<SVGSVGElement>;

export const SvgStyle = styled.svg<SvgProps>`
  ${utils}
  ${flex}
`;
