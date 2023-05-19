import { css } from 'styled-components';

export interface DisplayProps {
  display?: 'none' | 'inline' | 'block' | 'inline-block';
  displayL?: 'none' | 'inline' | 'block' | 'inline-block';
}

export const display = css<DisplayProps>`
  display: ${props => props.display};

  ${props =>
    props.displayL &&
    `
  @media ${props.theme.screens.laptopL} {
    display: ${props.displayL}
  }`}
`;
