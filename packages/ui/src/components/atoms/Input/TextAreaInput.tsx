import React, { FC } from 'react';
import styled from 'styled-components';

interface TextAreaInputProps {
  placeholder: string;
}

const TextAreaInputStyle = styled.textarea`
  position: relative;
  width: 100%;
  border: none;
  padding-top: ${({ theme }) => theme.spacing.two.spacing};
  padding-bottom: ${({ theme }) => theme.spacing.two.spacing};
  padding-left: ${({ theme }) => theme.spacing.three.spacing};
  padding-right: ${({ theme }) => theme.spacing.three.spacing};
  background-color: ${({ theme }) => theme.palette.background.input};
  border-radius: ${({ theme }) => theme.spacing.one.spacing};
  font-size: ${({ theme }) => theme.spacing.two.spacing};
  margin-bottom: ${({ theme }) => theme.spacing.two.spacing};
  color: white;
  height: 182px;
  ::placeholder {
    font-weight: 300;
    font-size: 14px;
    line-height: 21px;
    color: #8b8682;
  }
`;

export const TextAreaInput: FC<TextAreaInputProps> = ({ placeholder }) => (
  <TextAreaInputStyle placeholder={placeholder} />
);
