import React, { ReactNode } from 'react';
import styled, { css } from 'styled-components';
import { alignSelf, width, WidthProps, AlignSelfProps } from '../../util';

export interface ButtonProps
  extends WidthProps,
    AlignSelfProps,
    React.ButtonHTMLAttributes<HTMLButtonElement> {
  variation?: 'primary' | 'secondary' | 'dashedBorder' | 'warning';
  children?: ReactNode;
}

const buttonBaseStyle = css<ButtonProps>`
  ${props => {
    if (props.variation === 'secondary')
      return css`
        border: 0.6px solid #49433e;
        background-color: ${({ theme }) =>
          theme.palette.background.sepratorBackground};
        color: ${({ theme }) => theme.palette.text.textMuted};
      `;
    if (props.variation === 'primary')
      return css`
        transition: all 3s;
        background-image: ${({ theme }) => theme.palette.primary.primary};
        border: none;
        font-size: 14px;
        font-weight: 500;
        &:hover {
          background-image: linear-gradient(
            0deg,
            #e9b873 0.19%,
            #fedd8f 37.17%,
            #b78d51 100.19%
          );
        }
      `;
    if (props.variation === 'dashedBorder')
      return css`
        border: 1px dashed #49433e;
        background: transparent;
      `;
    if (props.variation === 'warning')
      return css`
        background: #ff624c;
        border: 0.6px solid #ff3518;
        border-radius: 6px;
        color: #ffffff;
        font-weight: 500;
      `;
    return '';
  }}
`;

export const ButtonStyle = styled.button<ButtonProps>`
  cursor: pointer;
  font-weight: 500;
  font-size: 14px;
  line-height: 21px;
  border-radius: 6px;
  display: inline-block;
  padding-top: ${({ theme }) => theme.spacing.one.spacing};
  padding-bottom: ${({ theme }) => theme.spacing.one.spacing};
  padding-left: ${({ theme }) => theme.spacing.three.spacing};
  padding-right: ${({ theme }) => theme.spacing.three.spacing};
  ${buttonBaseStyle}
  ${width}
  ${alignSelf}
`;
