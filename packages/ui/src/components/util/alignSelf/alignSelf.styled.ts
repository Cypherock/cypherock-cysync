import { css } from 'styled-components';

export interface AlignSelfProps {
  alignSelf?:
    | 'auto'
    | 'stretch'
    | 'center'
    | 'start'
    | 'end'
    | 'baseline'
    | 'initial'
    | 'inherit';
}

export const alignSelf = css<AlignSelfProps>`
  align-self: ${props => {
    if (props.alignSelf === 'start') return 'flex-start';
    if (props.alignSelf === 'end') return 'flex-end';
    return props.alignSelf;
  }};
`;
