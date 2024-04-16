import React, { FC } from 'react';
import styled from 'styled-components';

import { UtilsProps, utils } from '../utils';

export type TagType = 'tag' | 'info' | 'gold';

interface TagProps extends UtilsProps {
  children: React.ReactNode;
  type?: TagType;
}

const StyledTag = styled.div<TagProps>`
  font-weight: 500;
  flex-shrink: 0;

  ${({ type, theme }) =>
    (!type || type === 'tag') &&
    `
    padding: 2px 8px;
    color: ${theme.palette.border.muted};
    border-radius: 4px;
    border: 1px solid ${theme.palette.border.muted};
    font-size: 10px;
    align-self: center;
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

  ${({ type, theme }) =>
    type === 'gold' &&
    `
    display: flex;
    justify-content: center;
    align-items: center;
    height: 21px;
    padding: 0 4.5px;
    font-size: 11px;
    font-weight: 700;
    border-radius: 7px;
    background: ${theme.palette.background.separator};
    border: 0.5px solid ${theme.palette.border.muted};
    span {
      background: ${theme.palette.text.gold};
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
  `}
  ${utils}
`;

export const Tag: FC<TagProps> = ({ children, ...props }) => (
  <StyledTag {...props}>
    <span>{children}</span>
  </StyledTag>
);

Tag.defaultProps = {
  type: 'tag',
};
