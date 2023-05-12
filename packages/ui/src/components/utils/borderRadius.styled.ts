import { css } from 'styled-components';

export interface BorderRadiusProps {
  rounded?: number | 'full';
}

export const borderRadius = css<BorderRadiusProps>`
  ${props =>
    props.rounded &&
    `${`border-radius: ${
      props.rounded === 'full' ? '9999px' : `${props.rounded}px`
    };`}`}
`;
