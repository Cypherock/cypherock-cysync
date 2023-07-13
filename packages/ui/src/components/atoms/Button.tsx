import React, { FC, ReactNode } from 'react';
import styled, { RuleSet, css } from 'styled-components';

import { Throbber } from './Throbber';

import { UtilsProps, utils } from '../utils';

type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'warning'
  | 'danger'
  | 'text'
  | 'none';
type ButtonSize = 'lg' | 'md' | 'sm';
interface ButtonProps
  extends UtilsProps,
    React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leadingIcon?: ReactNode;
  children?: ReactNode;
  disabled?: boolean;
}

const buttonSizeMap: Record<ButtonSize, RuleSet<ButtonProps>> = {
  lg: css<ButtonProps>`
    border-radius: 8px;
    padding: 12px 32px;
    gap: 16px;
    font-size: 16px;
    font-weight: 500;
  `,
  md: css<ButtonProps>`
    border-radius: 6px;
    padding: 8px 24px;
    gap: 12px;
    font-size: 14px;
    font-weight: 500;
  `,
  sm: css<ButtonProps>`
    border-radius: 4px;
    padding: 6px 14px;
    gap: 8px;
    font-size: 12px;
    font-weight: 500;
  `,
};

const throbberSizeMap: Record<ButtonSize, number> = {
  lg: 20,
  md: 18,
  sm: 16,
};

const buttonAnimationData = {
  duration: '0.3s',
  curve: 'ease-out',
};

const buttonVariantCssMap: Record<ButtonVariant, RuleSet<ButtonProps>> = {
  primary: css<ButtonProps>`
    @property --a {
      syntax: '<angle>';
      inherits: false;
      initial-value: 90deg;
    }

    transition: --a ${buttonAnimationData.duration} ${buttonAnimationData.curve};
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
  `,
  secondary: css<ButtonProps>`
    &::before {
      content: '';
      position: absolute;
      inset: 0;
      border-radius: 8px;
      border: 1px solid transparent;
      background: ${props => props.theme.palette.golden} border-box;
      -webkit-mask: linear-gradient(#fff 0 0) padding-box,
        linear-gradient(#fff 0 0);
      -webkit-mask-composite: xor;
      mask-composite: exclude;
    }

    &:hover::before {
      background: ${props => props.theme.palette.silver} border-box;
      transition: all ${buttonAnimationData.duration}
        ${buttonAnimationData.curve};
    }

    position: relative;
    border: none;
    background: ${props => props.theme.palette.golden};
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    text-fill-color: transparent;

    &:hover {
      background: ${props => props.theme.palette.silver};
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
  `,
  warning: css<ButtonProps>``,
  danger: css<ButtonProps>``,
  text: css<ButtonProps>`
    background: none;
    outline: none;
    border: none;
    transition: none;
    padding: 0;
    &:hover {
      filter: brightness(150%);
      cursor: pointer;
    }
  `,
  none: css<ButtonProps>`
    background: transparent;
    border: none;
    padding: 0;
  `,
};

const buttonStyle = css<ButtonProps>`
  ${props => {
    if (props.disabled)
      return css`
        background-color: ${({ theme }) => theme.palette.background.disabled};
        color: ${({ theme }) => theme.palette.text.disabled};
        border: 1px solid transparent;
        cursor: not-allowed;
      `;
    return buttonVariantCssMap[props.variant ?? 'primary'];
  }}
`;

const buttonSizeStyle = css<ButtonProps>`
  ${props => buttonSizeMap[props.size ?? 'md']}
`;

const ButtonStyle = styled.button<ButtonProps>`
  cursor: pointer;
  display: inline-flex;

  ${buttonSizeStyle}
  ${buttonStyle}

  &:active {
    box-shadow: 0px 0px 4px 4px rgba(0, 0, 0, 0.4) inset;
    transition: box-shadow ${buttonAnimationData.duration};
    ${buttonAnimationData.curve};
  }
  ${props => props.disabled && 'opacity: 0.5;'}
  ${utils}
`;

export const Button: FC<ButtonProps> = ({
  leadingIcon,
  isLoading,
  children,
  ...props
}) => {
  const Leading = isLoading ? (
    <Throbber size={throbberSizeMap[props.size ?? 'md']} strokeWidth={2} />
  ) : (
    leadingIcon
  );
  return (
    <ButtonStyle type="button" disabled={isLoading} {...props}>
      {Leading}
      {children}
    </ButtonStyle>
  );
};

Button.defaultProps = {
  variant: 'primary',
  size: 'md',
  children: undefined,
  leadingIcon: undefined,
  isLoading: false,
  disabled: false,
};
