import React, { FC, ReactNode, LabelHTMLAttributes } from 'react';
import styled, { css } from 'styled-components';

interface InputLabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  children?: ReactNode;
  margin?: string;
  className?: string;
  fontSize?: string;
  fontWeight?: string;
  textAlign?: 'left' | 'right';
  noWrap?: boolean;
  marginLeft?: string;
  padding?: string;
  marginRight?: string;
  clickable?: boolean;
  inline?: boolean;
}

const InputLabelStyle = styled.label<InputLabelProps>`
  display: ${({ inline }) => (inline ? 'inline-block' : 'block')};
  text-align: right;
  width: 100%;

  font-size: ${({ fontSize }) => fontSize ?? '14px'};
  font-weight: ${({ fontWeight }) => fontWeight ?? '500'};
  &.gold-label {
    background: linear-gradient(
      var(--a),
      #e9b873 0.19%,
      #fedd8f 37.17%,
      #b78d51 100.19%
    );
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  color: ${({ theme }) => theme.palette.text.muted};
  padding: ${({ padding }) => padding ?? '0px 10px'};
  margin-bottom: 8px;
  margin: ${({ margin, theme }) => margin ?? theme.spacing.one.spacing};
  ${({ textAlign }) => textAlign === 'left' && 'text-align: left;'}
  white-space: ${({ noWrap }) => (noWrap ? 'nowrap' : 'normal')};
  margin-left: ${({ marginLeft }) => marginLeft === 'auto' && 'auto'};
  margin-right: ${({ marginRight }) => marginRight ?? undefined};

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
  marginLeft,
  padding,
  marginRight,
  clickable = false, // default value
  ...props
}) => (
  <InputLabelStyle
    className={className}
    fontSize={fontSize}
    textAlign={textAlign}
    noWrap={noWrap}
    marginLeft={marginLeft}
    padding={padding}
    marginRight={marginRight}
    clickable={clickable}
    {...props}
  >
    {children}
  </InputLabelStyle>
);

InputLabel.defaultProps = {
  children: null,
  margin: undefined,
  className: '',
  fontSize: undefined,
  marginLeft: undefined,
  padding: undefined,
  marginRight: undefined,
  noWrap: false,
  clickable: false,
  fontWeight: undefined,
  textAlign: undefined,
  inline: false,
};
