import React, { FC, MouseEventHandler, ReactNode } from 'react';
import styled, { css } from 'styled-components';
import {
  flex,
  width,
  WidthProps,
  FlexProps,
  display,
  DisplayProps,
  spacing,
  SpacingProps,
} from '../utils';

interface ButtonProps
  extends WidthProps,
    DisplayProps,
    FlexProps,
    SpacingProps,
    React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | 'primary'
    | 'secondary'
    | 'dashed'
    | 'warning'
    | 'none'
    | 'primary-outlined';
  children?: ReactNode;
  onClick?: MouseEventHandler<HTMLButtonElement>;
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
        background: #ff624c;
        border: 0.6px solid #ff3518;
        border-radius: 6px;
        color: #ffffff;
        font-weight: 500;
      `;
    if (props.variant === 'primary-outlined')
      return css`
        display: flex;
        align-items: center;
        margin: auto;
        position: relative;
        box-sizing: border-box;
        background: ${({ theme }) => theme.palette.background.sideBar};
        border: solid 0px transparent;

        &:before {
          content: '';
          position: absolute;
          top: 0;
          right: 0;
          bottom: 0;
          left: 0;
          z-index: -1;
          margin: -1.5px;
          border-radius: 7px;
          background: ${({ theme }) => theme.palette.golden};
        }
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
  ${spacing}
  ${display}
  ${buttonBaseStyle}
  ${width}
  ${flex}
`;

export const Button: FC<ButtonProps> = ({ children, onClick, ...props }) => (
  <ButtonStyle onClick={onClick} {...props}>
    {children}
  </ButtonStyle>
);

Button.defaultProps = {
  variant: 'primary',
  children: null,
  onClick: () => null,
};
