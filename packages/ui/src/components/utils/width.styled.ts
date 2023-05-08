import { css } from 'styled-components';

export interface WidthProps {
  width?: '100%' | '25%' | '35%' | '15%';
}

const widthObj: Record<string, string> = {
  '100%': '100%',
  '25%': '25%',
  '35%': '35%',
  '15%': '15%',
};

export const width = css<WidthProps>`
  ${props =>
    props.width &&
    `
    width: ${widthObj[props.width]};`}
`;
