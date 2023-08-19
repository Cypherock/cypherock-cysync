import React, { FC } from 'react';
import styled from 'styled-components';

import { FontProps, SpacingProps, font, spacing } from '../utils';

interface TagProps extends SpacingProps, FontProps {
  children: React.ReactNode;
  type?: 'tag' | 'info';
}

const StyledTag = styled.div<TagProps>`
  font-weight: 500;
  align-self: flex-start;
  flex-shrink: 0;

  ${({ type, theme }) =>
    (!type || type === 'tag') &&
    `
    padding: 2px 8px;
    color: ${theme.palette.border.muted};
    border-radius: 4px;
    border: 1px solid ${theme.palette.border.muted};
    font-size: 10px;
  `}

  ${({ type, theme }) =>
    type === 'info' &&
    `
    display: flex;
    padding: 4px 12px;
    align-items: center;
    height: 21px auto;
    gap: 16px;
    font-size: 14px;
    font-style: normal;
    line-height: normal;
    border-radius: 8px;
    background: ${theme.palette.background.content};
    color: ${theme.palette.text.muted};
    border: 1px solid ${theme.palette.border.popup};
  `}
  ${spacing}
  ${font}
`;

export const Tag: FC<TagProps> = ({ children, ...props }) => (
  <StyledTag {...props}>{children}</StyledTag>
);

Tag.defaultProps = {
  type: 'tag',
};
