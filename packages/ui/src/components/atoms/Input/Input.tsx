import React, { FC } from 'react';
import styled from 'styled-components';

interface InputProps {
  type: string;
  placeholder: string;
}

const InputStyle = styled.input`
  position: relative;
  width: 100%;
  border: none;
  padding-top: ${({ theme }) => theme.spacing.two.spacing};
  padding-bottom: ${({ theme }) => theme.spacing.two.spacing};
  padding-left: ${({ theme }) => theme.spacing.three.spacing};
  padding-right: ${({ theme }) => theme.spacing.three.spacing};
  background-color: ${({ theme }) => theme.palette.background.inputBackground};
  border-radius: ${({ theme }) => theme.spacing.one.spacing};
  font-size: ${({ theme }) => theme.spacing.two.spacing};
  margin-bottom: ${({ theme }) => theme.spacing.two.spacing};
  color: white;
  ::placeholder {
    font-weight: 300;
    font-size: 14px;
    line-height: 21px;
    letter-spacing: 0.12em;
    color: #8b8682;
  }
`;

export const Input: FC<InputProps> = ({ placeholder, type }) => (
  <InputStyle type={type} placeholder={placeholder} />
);
