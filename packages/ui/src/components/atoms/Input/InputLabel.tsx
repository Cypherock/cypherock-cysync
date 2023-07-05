import React, { FC, ReactNode, LabelHTMLAttributes } from 'react';
import styled from 'styled-components';

interface InputLabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  children?: ReactNode;
  margin?: string;
}

const InputLabelStyle = styled.label<InputLabelProps>`
  display: block;
  text-align: left;
  width: 100%;

  font-size: 14px;
  font-weight: 300;
  letter-spacing: 0.12em;

  color: ${({ theme }) => theme.palette.text.muted};
  padding: 0px 10px 0px 10px;
  margin-bottom: 8px;
  margin: ${({ margin, theme }) => margin ?? theme.spacing.one.spacing};
`;

export const InputLabel: FC<InputLabelProps> = ({ children, ...props }) => (
  <InputLabelStyle {...props}>{children}</InputLabelStyle>
);

InputLabel.defaultProps = {
  children: null,
  margin: undefined,
};
