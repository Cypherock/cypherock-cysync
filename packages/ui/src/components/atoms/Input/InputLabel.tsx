import React, { FC, LabelHTMLAttributes, ReactNode } from 'react';
import styled, { css } from 'styled-components';

import {
  BorderProps,
  DisplayProps,
  FontProps,
  SpacingProps,
  border,
  display,
  font,
  spacing,
} from '../../utils';
import { goldenGradient } from '../../utils/Gradient';

interface InputLabelProps
  extends LabelHTMLAttributes<HTMLLabelElement>,
    SpacingProps,
    BorderProps,
    FontProps,
    DisplayProps {
  children?: ReactNode;
  $noWrap?: boolean;
  $textAlign?: 'left' | 'center' | 'right';
  $cursor?: boolean;
}

const InputLabelStyle = styled.label<InputLabelProps>`
  display: block;
  text-align: ${({ $textAlign }) => $textAlign ?? 'left'};

  width: 100%;
  font-size: 14px;
  font-weight: 300;
  letter-spacing: 0.12em;

  ${({ theme, color }) => {
    if (color === 'gradient') {
      return css`
        ${goldenGradient('color')}
      `;
    }
    return css`
      color: ${color ? theme.palette[color] : theme.palette.text.muted};
    `;
  }}

  padding: 0px 10px 0px 10px;
  margin-bottom: 8px;

  ${({ $noWrap }) => $noWrap && 'white-space: nowrap;'}

  ${spacing}
  ${border}
  ${font} 
  ${display}
  ${({ $cursor }) => $cursor && 'cursor: pointer;'}
`;

export const InputLabel: FC<InputLabelProps> = ({
  children,
  $noWrap = false,
  $textAlign,
  ...props
}) => (
  <InputLabelStyle $noWrap={$noWrap} $textAlign={$textAlign} {...props}>
    {children}
  </InputLabelStyle>
);

InputLabel.defaultProps = {
  children: undefined,
  $noWrap: false,
  $textAlign: 'left',
  $cursor: false,
};
