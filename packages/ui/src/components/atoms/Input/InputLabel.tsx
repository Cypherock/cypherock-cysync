import React, { FC, ReactNode } from 'react';
import styled from 'styled-components';

interface InputLabelProps {
  children?: ReactNode;
}

const InputLabelStyle = styled.label`
  display: block;
  text-align: left;
  width: 100%;

  display: block;
  text-align: left;
  width: 100%;

  font-size: 14px;
  font-weight: 300;
  letter-spacing: 0.12em;

  color: ${({ theme }) => theme.palette.text.muted};
  padding: 0px 10px 0px 10px;
  margin-bottom: 8px;
`;

export const InputLabel: FC<InputLabelProps> = ({ children }) => (
  <InputLabelStyle>{children}</InputLabelStyle>
);

InputLabel.defaultProps = {
  children: null,
};
