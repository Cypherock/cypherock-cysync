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
  variant?: 'primary' | 'secondary' | 'dashed' | 'warning' | 'text' | 'none';
  leadingIcon?: 'spinner' | ReactNode;
  children?: ReactNode;
}

const buttonBaseStyle = css<ButtonProps>`
  ${props => {
    if (props.disabled)
      return css`
        background-color: ${({ theme }) => theme.palette.background.disabled};
        color: ${({ theme }) => theme.palette.text.disabled};
        border: 1px solid transparent;
        cursor: not-allowed;
      `;
    if (props.variant === 'primary')
      return css`
        @property --a {
          syntax: '<angle>';
          inherits: false;
          initial-value: 90deg;
        }

        transition: --a 0.15s ease-in-out;
        background: linear-gradient(
          var(--a),
          #e9b873 0.19%,
          #fedd8f 37.17%,
          #b78d51 100.19%
        );
        &:hover {
          --a: 180deg;
        }
        border: 1px solid transparent;
      `;
    if (props.variant === 'secondary')
      return css`
        &::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 8px;
          border: 1px solid transparent;
          background: ${props.theme.palette.golden} border-box;
          -webkit-mask: linear-gradient(#fff 0 0) padding-box,
            linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
        }

        &:hover::before {
          background: ${props.theme.palette.silver} border-box;
        }

        position: relative;
        border: none;
        background: ${props.theme.palette.golden};
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        text-fill-color: transparent;

        &:hover {
          background: ${props.theme.palette.silver};
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
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
  transition: all 0.15s ease-in-out;
  display: inline-block;
  padding-top: ${({ theme }) => theme.spacing.one.spacing};
  padding-bottom: ${({ theme }) => theme.spacing.one.spacing};
  padding-left: ${({ theme }) => theme.spacing.three.spacing};
  padding-right: ${({ theme }) => theme.spacing.three.spacing};
  ${spacing}
  ${display}
  ${buttonBaseStyle}
  ${display}
  ${width}
  ${flex}
  ${utils}
`;

export const Button: FC<ButtonProps> = ({ children, ...props }) => (
  <ButtonStyle type="button" {...props}>
    {children}
  </ButtonStyle>
);

Button.defaultProps = {
  variant: 'primary',
  children: undefined,
  leadingIcon: undefined,
};
