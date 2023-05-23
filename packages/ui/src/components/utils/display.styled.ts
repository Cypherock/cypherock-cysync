import { css } from 'styled-components';

export interface DisplayProps {
  display?: 'none' | 'inline' | 'block' | 'inline-block' | 'flex';
}

export const display = css<DisplayProps>`
  display: ${props => props.display};
`;
