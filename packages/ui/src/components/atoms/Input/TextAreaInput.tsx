import React, { ChangeEvent, FC } from 'react';
import styled from 'styled-components';
import { UtilsProps, utils } from '../../utils';

interface TextAreaInputProps extends UtilsProps {
  value?: string;
  onChange?: React.Dispatch<React.SetStateAction<string>>;
  disabled?: boolean;
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
  ${utils}
`;

export const TextAreaInput: FC<TextAreaInputProps> = ({
  onChange,
  ...props
}) => {
  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    if (onChange) onChange(event.target.value);
  };

  return <TextAreaInputStyle {...props} onChange={handleChange} />;
};

TextAreaInput.defaultProps = {
  value: '',
  onChange: undefined,
  disabled: false,
};
