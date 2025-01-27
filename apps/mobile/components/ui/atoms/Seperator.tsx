import { ViewProps } from 'react-native';
import styled, { css } from 'styled-components/native';

interface SeperatorProps extends ViewProps {
  type?: 'v' | 'h';
}

const SeperatorTypeStyle = {
  v: css`
    height: 100%;
    min-height: 10px;
    width: 1px;
  `,
  h: css`
    width: 100%;
    height: 1px;
  `,
};

export const Seperator = styled.View<SeperatorProps>`
  background: ${({ theme }) => theme.palette.border.secondary};
  ${({ type = 'h' }) => SeperatorTypeStyle[type]}
`;
