import React, { FC, ReactNode } from 'react';
import styled from 'styled-components';

interface InputLabelProps {
  children?: ReactNode;
}

const InputLabelStyle = styled.label`
  display: block;
  text-align: left;
  width: 100%;

  font-size: 14px;
  font-weight: 300;
  letter-spacing: 0.12em;

  color: ${({ theme }) => theme.palette.text.muted};
  margin: ${({ theme }) => theme.spacing.one.spacing};
`;

export const InputLabel: FC<InputLabelProps> = ({ children }) => (
  <InputLabelStyle>{children}</InputLabelStyle>
);

InputLabel.defaultProps = {
  children: null,
};
