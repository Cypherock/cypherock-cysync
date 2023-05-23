import { css } from 'styled-components';

export interface AlignSelfProps {
  $alignSelf?:
    | 'auto'
    | 'stretch'
    | 'center'
    | 'start'
    | 'end'
    | 'baseline'
    | 'initial'
    | 'inherit';
}

const alignSelfObj: Record<string, string> = {
  start: 'flex-start',
  end: 'flex-end',
};
export const $alignSelf = css<AlignSelfProps>`
  ${props =>
    props.$alignSelf &&
    `align-self: ${alignSelfObj[props.$alignSelf] ?? props.$alignSelf};`}
`;
