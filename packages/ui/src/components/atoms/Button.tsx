import React, { FC, ReactNode, useState } from 'react';
import styled, { RuleSet, css } from 'styled-components';

import { Throbber } from './Throbber';

import { SvgProps } from '../../assets';
import { svgGradients } from '../GlobalStyles';
import { UtilsProps, goldenGradient, utils } from '../utils';

type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'secondaryLight'
  | 'warning'
  | 'danger'
  | 'text'
  | 'icon'
  | 'none';
type ButtonSize = 'lg' | 'md' | 'sm';
export interface ButtonProps
  extends UtilsProps,
    React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  icon?: ReactNode;
  iconComponent?: React.FC<SvgProps>;
  children?: ReactNode;
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
    ${goldenGradient('background')};
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
  secondaryLight: css<ButtonProps>`
    background: none;
    outline: none;

    border: 1px solid ${props => props.theme.palette.border.separator};
    color: ${({ theme }) => theme.palette.text.white};
    border-radius: 8px;

    &:hover {
      color: ${({ theme }) => theme.palette.text.muted};
    }
  `,
  warning: css<ButtonProps>``,
  danger: css<ButtonProps>`
    outline: none;
    background: ${({ theme }) => theme.palette.background.danger};
    color: ${({ theme }) => theme.palette.text.white};
    border: none;
    border-radius: 8px;
  `,
  text: css<ButtonProps>`
    background: none;
    outline: none;
    border: none;
    transition: none;
    padding: 0;
    &:not([disabled]):hover {
      filter: brightness(150%);
    }
    &:disabled {
      cursor: auto;
    }
  `,
  icon: css<ButtonProps>`
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
    if (props.disabled && !['text', 'none'].includes(props.variant as string))
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
  ${props => props.variant !== 'icon' && buttonSizeMap[props.size ?? 'md']}
`;

const ButtonStyle = styled.button<ButtonProps>`
  cursor: pointer;
  display: inline-flex;

  ${buttonSizeStyle}
  ${buttonStyle}

  &:active {
    box-shadow: 0px 0px 4px 4px rgba(0, 0, 0, 0.4) inset;
    transition: box-shadow ${buttonAnimationData.duration}
      ${buttonAnimationData.curve};
  }
  ${({ disabled }) => disabled && `cursor: not-allowed;`}
  ${utils}
`;

export const Button: FC<ButtonProps> = ({
  icon,
  isLoading,
  children,
  iconComponent: IconComponent,
  ...props
}) => {
  const [isHovered, setIsHovered] = useState(false);

  let Icon = isLoading ? (
    <Throbber size={throbberSizeMap[props.size ?? 'md']} strokeWidth={2} />
  ) : (
    icon
  );

  if (!isLoading && IconComponent) {
    Icon = (
      <IconComponent
        fill={`url(#${isHovered ? svgGradients.silver : svgGradients.gold})`}
      />
    );
  }

  return (
    <ButtonStyle
      type="button"
      disabled={isLoading}
      {...props}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {Icon}
      {children}
    </ButtonStyle>
  );
};

Button.defaultProps = {
  variant: 'primary',
  size: 'md',
  children: undefined,
  icon: undefined,
  isLoading: false,
  iconComponent: undefined,
};
