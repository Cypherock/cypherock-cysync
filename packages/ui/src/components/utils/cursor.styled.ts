import React from 'react';
import { css } from 'styled-components';

export interface CursorProps {
  $cursor?: React.CSSProperties['cursor'];
}

export const cursor = css<CursorProps>`
  ${props => props.$cursor && `cursor: ${props.$cursor}`};
`;
