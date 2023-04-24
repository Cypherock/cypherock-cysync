import { css } from 'styled-components';
import { theme } from '../../../themes/theme.styled';

export interface BorderRadiusProps {
  rounded?: 'roundedOne' | 'roundedTwo' | 'roundedFull';
}
export interface WidthProps {
  width?: 'wFull' | 'w25' | 'w35' | 'w15';
}

export const borderRadius = css<BorderRadiusProps>`
  border-radius: ${props => {
    if (props.rounded === 'roundedOne') return theme.spacing.one.spacing;
    if (props.rounded === 'roundedTwo') return theme.spacing.two.spacing;
    if (props.rounded === 'roundedFull') return '9999px';
    return '';
  }};
`;

export const width = css<WidthProps>`
  width: ${props => {
    if (props.width === 'wFull') return '100%';
    if (props.width === 'w25') return '25%';
    if (props.width === 'w35') return '35%';
    if (props.width === 'w15') return '15%';
    return '';
  }};
`;
