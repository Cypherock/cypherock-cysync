import React, { FC, ReactNode } from 'react';
import styled, { css } from 'styled-components';
import {
  flex,
  width,
  WidthProps,
  FlexProps,
  utils,
  UtilsProps,
  display,
  DisplayProps,
  spacing,
  SpacingProps,
} from '../utils';

interface ButtonProps
  extends WidthProps,
    DisplayProps,
    FlexProps,
    UtilsProps,
    SpacingProps,
    React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'dashed' | 'warning' | 'none' | 'text';
  children?: ReactNode;
}

const buttonBaseStyle = css<ButtonProps>`
  ${props => {
    if (props.variant === 'primary')
      return css`
        background: ${({ theme }) => theme.palette.golden};
        border: none;
        font-size: 14px;
        font-weight: 500;
        transition: all 0.6s ease-out;
        &:hover {
          background: linear-gradient(
            180deg,
            #e9b873 0.19%,
            #fedd8f 37.17%,
            #b78d51 100.19%
          );
        }
      `;
    if (props.variant === 'secondary')
      return css`
        border: 0.6px solid #49433e;
        background-color: ${({ theme }) => theme.palette.background.separator};
        color: ${({ theme }) => theme.palette.text.muted};
      `;
    if (props.variant === 'dashed')
      return css`
        border: 1px dashed #49433e;
        background: transparent;
      `;
    if (props.variant === 'warning')
      return css`
        background: ${({ theme }) => theme.palette.warning};
        border: 0.6px solid #ff3518;
        border-radius: 6px;
        color: #ffffff;
        font-weight: 500;
      `;
    if (props.variant === 'text')
      return css`
        background: none;
        outline: none;
        border: none;
        transition: none;
        padding: 0;
        &:hover {
          filter: brightness(150%);
          cursor: pointer;
        }
      `;
    if (props.variant === 'none')
      return css`
        background: transparent;
        border: none;
        padding: 0;
      `;
    return '';
  }}
`;

const ButtonStyle = styled.button<ButtonProps>`
  cursor: pointer;
  font-weight: 500;
  font-size: 14px;
  line-height: 21px;
  border-radius: 6px;
  transition: all 0.6s ease-in-out;
  display: inline-block;
  padding-top: ${({ theme }) => theme.spacing.one.spacing};
  padding-bottom: ${({ theme }) => theme.spacing.one.spacing};
  padding-left: ${({ theme }) => theme.spacing.three.spacing};
  padding-right: ${({ theme }) => theme.spacing.three.spacing};
  ${spacing}
  ${display}
  ${buttonBaseStyle}
  ${width}
  ${flex}
  ${utils}
`;

export const Button: FC<ButtonProps> = ({ children, onClick, ...props }) => (
  <ButtonStyle onClick={onClick} {...props}>
    {children}
  </ButtonStyle>
);

Button.defaultProps = {
  variant: 'primary',
  children: undefined,
};
