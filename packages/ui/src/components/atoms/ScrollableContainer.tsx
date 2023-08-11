import styled from 'styled-components';

import { height, HeightProps } from '../utils';

export const ScrollableContainer = styled.div<HeightProps>`
  width: 100%;
  overflow-y: auto;
  overflow-x: hidden;

  ${height}
`;
