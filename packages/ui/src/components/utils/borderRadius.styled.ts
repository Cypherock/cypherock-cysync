import { css } from 'styled-components';
import { theme } from '../../themes/theme.styled';

export interface BorderRadiusProps {
  rounded?: '1' | '2' | 'full';
}

const borderRadiusObj = {
  '1': theme.spacing.one.spacing,
  '2': theme.spacing.one.spacing,
  full: '9999px',
};

export const borderRadius = css<BorderRadiusProps>`
  ${props =>
    props.rounded &&
    `${`border-radius: ${borderRadiusObj[props.rounded] ?? props.rounded}; `}`}
`;
