import React, { FC } from 'react';
import styled from 'styled-components';

interface SearchBarProps {
  placeholder: string;
}

export const SearchBarStyle = styled.input`
  width: 100%;
  border: 1px solid #39322c;
  padding-top: ${({ theme }) => theme.spacing.two.spacing};
  padding-bottom: ${({ theme }) => theme.spacing.two.spacing};
  padding-left: ${({ theme }) => theme.spacing.three.spacing};
  padding-right: ${({ theme }) => theme.spacing.three.spacing};
  background-color: ${({ theme }) => theme.palette.background.input};
  border-radius: ${({ theme }) => theme.spacing.one.spacing};
  color: ${({ theme }) => theme.palette.text.muted};
  font-size: ${({ theme }) => theme.spacing.two.spacing};
  ::placeholder {
    color: ${({ theme }) => theme.palette.text.muted};
  }
`;

export const SearchBar: FC<SearchBarProps> = ({ placeholder }) => (
  <SearchBarStyle placeholder={placeholder} />
);
