import React, { FC, ReactNode } from 'react';
import styled, { css } from 'styled-components';
import {
  flex,
  width,
  WidthProps,
  FlexProps,
  DisplayProps,
  display,
} from '../utils';

interface ButtonProps
  extends WidthProps,
    FlexProps,
    DisplayProps,
    React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'dashed' | 'warning' | 'none';
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
        transition: all 3s ease-out;
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
        background: #ff624c;
        border: 0.6px solid #ff3518;
        border-radius: 6px;
        color: #ffffff;
        font-weight: 500;
      `;
    if (props.variant === 'none')
      return css`
        background: transparent;
        border: none;
        padding: 0px;
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
  ${buttonBaseStyle}
  ${display}
  ${width}
  ${flex}
`;

export const Button: FC<ButtonProps> = ({ children, ...props }) => (
  <ButtonStyle {...props}>{children}</ButtonStyle>
);

Button.defaultProps = {
  variant: 'primary',
  children: null,
};
