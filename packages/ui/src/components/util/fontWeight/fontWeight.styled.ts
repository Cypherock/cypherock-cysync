import { css } from 'styled-components';

export interface FontWeightProps {
  font?:
    | 'fontThin'
    | 'fontExtralight'
    | 'fontLight'
    | 'fontNormal'
    | 'fontMedium'
    | 'fontSemiBold'
    | 'fontBold'
    | 'fontExtraBold';
}

export const fontWeight = css<FontWeightProps>`
  font-weight: ${props => {
    if (props.font === 'fontThin') return '100';
    if (props.font === 'fontExtralight') return '200';
    if (props.font === 'fontLight') return '300';
    if (props.font === 'fontNormal') return '400';
    if (props.font === 'fontMedium') return '500';
    if (props.font === 'fontSemiBold') return '600';
    if (props.font === 'fontBold') return '700';
    if (props.font === 'fontExtraBold') return '800';
    return '';
  }};
`;
