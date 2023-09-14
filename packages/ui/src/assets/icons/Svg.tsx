import { SVGProps } from 'react';
import styled from 'styled-components';

import { utils, UtilsProps } from '../../components/utils';

export type SvgProps = UtilsProps & SVGProps<SVGSVGElement>;

export const SvgStyle = styled.svg<SvgProps>`
  ${utils}
`;
