import styled from 'styled-components';

import { utils, UtilsProps } from '../utils';

export const ScrollableContainer = styled.div<UtilsProps>`
  width: 100%;
  overflow-y: auto;
  overflow-x: hidden;

  ${utils}
`;
