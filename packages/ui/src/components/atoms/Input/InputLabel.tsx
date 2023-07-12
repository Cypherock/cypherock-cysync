import React, { FC, ReactNode, LabelHTMLAttributes } from 'react';
import styled, { css } from 'styled-components';

import { spacing, SpacingProps, BorderProps, border } from '../../utils';

interface InputLabelProps
  extends LabelHTMLAttributes<HTMLLabelElement>,
    SpacingProps,
    BorderProps {
  children?: ReactNode;
  className?: string;
  fontSize?: string;
  fontWeight?: string;
  textAlign?: 'left' | 'right';
  noWrap?: boolean;
  clickable?: boolean;
  inline?: boolean;
}

const InputLabelStyle = styled.label<InputLabelProps>`
  display: ${({ inline }) => (inline ? 'inline-block' : 'block')};
  text-align: right;
  width: 100%;

  font-size: ${({ fontSize }) => fontSize ?? '14px'};
  font-weight: ${({ fontWeight }) => fontWeight ?? '500'};
  color: ${({ theme }) => theme.palette.text.muted};
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
  textAlign = 'left',
  noWrap = false,
  clickable = false, // default value
  ...props
}) => (
  <InputLabelStyle
    className={className}
    fontSize={fontSize}
    textAlign={textAlign}
    noWrap={noWrap}
    clickable={clickable}
    {...props}
  >
    {children}
  </InputLabelStyle>
);

InputLabel.defaultProps = {
  children: null,
  className: '',
  fontSize: undefined,
  noWrap: false,
  clickable: false,
  fontWeight: undefined,
  textAlign: undefined,
  inline: false,
};
