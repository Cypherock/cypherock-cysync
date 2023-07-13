import React, { FC, ReactNode, LabelHTMLAttributes } from 'react';
import styled, { css } from 'styled-components';

import {
  spacing,
  SpacingProps,
  BorderProps,
  border,
  font,
  display,
  DisplayProps,
  FontProps,
} from '../../utils';

interface InputLabelProps
  extends LabelHTMLAttributes<HTMLLabelElement>,
    SpacingProps,
    BorderProps,
    FontProps,
    DisplayProps {
  children?: ReactNode;
  className?: string;
  fontSize?: number;
  fontWeight?: FontProps['$fontWeight'];
  textAlign?: 'left' | 'right';
  noWrap?: boolean;
  clickable?: boolean;
  inline?: boolean;
  color?: string;
}

const InputLabelStyle = styled.label<InputLabelProps>`
  ${font} // Utilize the font utility
  ${display} // Utilize the display utility
  text-align: right;
  width: 100%;

  color: ${({ theme, color }) => color ?? theme.palette.text.muted};
  ${({ textAlign }) => textAlign === 'left' && 'text-align: left;'}
  white-space: ${({ noWrap }) => (noWrap ? 'nowrap' : 'normal')};
  ${spacing}
  ${border}

  ${({ clickable }) =>
    clickable &&
    css`
      cursor: pointer;

      &:hover {
        text-decoration: underline;
      }
    `}
`;

export const InputLabel: FC<InputLabelProps> = ({
  children,
  className,
  fontSize,
  fontWeight = 'normal',
  textAlign = 'left',
  noWrap = false,
  clickable = false,
  color,
  ...props
}) => (
  <InputLabelStyle
    className={className}
    $fontSize={fontSize}
    $fontWeight={fontWeight}
    textAlign={textAlign}
    noWrap={noWrap}
    clickable={clickable}
    color={color}
    {...props}
  >
    {children}
  </InputLabelStyle>
);

InputLabel.defaultProps = {
  children: null,
  className: '',
  fontSize: undefined,
  fontWeight: 'normal',
  noWrap: false,
  clickable: false,
  textAlign: undefined,
  inline: false,
  color: undefined,
};
