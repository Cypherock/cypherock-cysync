import React, { FC } from 'react';
import styled from 'styled-components';

import { UtilsProps, utils } from '../../utils';
import { Flex, Typography } from '../../atoms';

interface TextAreaInputProps extends UtilsProps {
  value?: string;
  onChange?: (val: string) => void;
  onBlur?: (val: string) => void;
  disabled?: boolean;
  placeholder: string;
  maxChars?: number;
  currentChars?: number;
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
  color: white;
  height: 182px;
  resize: none;
  ::placeholder {
    font-weight: 300;
    font-size: 14px;
    line-height: 21px;
    color: #8b8682;
  }
  ${utils}
`;

export const TextAreaInput: FC<TextAreaInputProps> = ({
  onChange,
  onBlur,
  maxChars,
  currentChars = 0,
  ...props
}) => (
  <Flex direction="column" width="100%" gap={8} mb={2}>
    <TextAreaInputStyle
      {...props}
      onChange={e => onChange?.(e.target.value)}
      onBlur={e => onBlur?.(e.target.value)}
      maxLength={maxChars}
    />
    {maxChars && (
      <Flex width="100%" $flex={1} justify="flex-end">
        <Typography
          color="muted"
          $fontSize={8}
        >{`${currentChars}/${maxChars}`}</Typography>
      </Flex>
    )}
  </Flex>
);

TextAreaInput.defaultProps = {
  value: '',
  onChange: undefined,
  onBlur: undefined,
  disabled: false,
  maxChars: undefined,
  currentChars: 0,
};
