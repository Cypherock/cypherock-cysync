import React, { FC, useState } from 'react';
import styled from 'styled-components';

import { Flex } from './Flex';

import { WidthProps, width } from '../utils';

interface NomineeMessageProps extends WidthProps {
  icon: React.ReactNode;
  placeholder: string;
  onEdit: (value: string) => void;
}
const StyledNomineeMessage = styled.div`
  display: flex;
  width: 624px;
  padding: 8px 16px;
  justify-content: space-between;
  align-items: center;
  background: ${({ theme }) => theme.palette.background.slate};
  border-radius: 8px;
  ${width}
`;

const PlaceholderInput = styled.input`
  font-family: Poppins;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  color: ${({ theme }) => theme.palette.text.muted};
  background: transparent;
  border: none;
  outline: none;
  width: 100%;

  &::placeholder {
    color: ${({ theme }) => theme.palette.text.muted};
  }

  &:not(:placeholder-shown) {
    color: ${({ theme }) => theme.palette.text.white};
  }
`;

const EditButton = styled.div`
  background: ${({ theme }) => theme.palette.text.gold};
  font-family: Poppins;
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  cursor: pointer;
`;

export const NomineeMessage: FC<NomineeMessageProps> = ({
  icon,
  placeholder,
  onEdit,
  ...props
}) => {
  const [inputValue, setInputValue] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setInputValue(value);
    onEdit(value);
  };

  return (
    <StyledNomineeMessage {...props}>
      <Flex width="367.167px" align="center" gap={16} shrink={0}>
        <Flex width="13.803px" height="16px" shrink={0}>
          {icon}
        </Flex>
        <PlaceholderInput
          value={inputValue}
          onChange={handleInputChange}
          placeholder={placeholder}
        />
      </Flex>
      <EditButton onClick={() => onEdit('')}>Edit</EditButton>
    </StyledNomineeMessage>
  );
};
