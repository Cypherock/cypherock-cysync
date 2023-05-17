import React, { FC, ReactNode } from 'react';
import styled from 'styled-components';

interface InputLabelProps {
  children?: ReactNode;
}

const InputLabelStyle = styled.label`
  font-size: 14px;
  color: ${({ theme }) => theme.palette.text.textMuted};
  margin: ${({ theme }) => theme.spacing.one.spacing};
  letter-spacing: 0.12em;
`;

export const InputLabel: FC<InputLabelProps> = ({ children }) => (
  <InputLabelStyle>{children}</InputLabelStyle>
);

InputLabel.defaultProps = {
  children: null,
};
