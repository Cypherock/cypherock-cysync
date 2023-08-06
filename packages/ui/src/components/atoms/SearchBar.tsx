import React, { FC } from 'react';
import styled from 'styled-components';
import { searchIcon } from '../../assets';
import { Image } from './Image';

interface SearchBarProps {
  placeholder: string;
}

const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  padding: 12px 24px;
  align-items: center;
  gap: 14px;
  background-color: ${({ theme }) => theme.palette.background.input};
  border-radius: ${({ theme }) => theme.spacing.one.spacing};
`;

const SearchIcon = styled.div`
  margin: 0 10px;
  align-items: center;
`;

export const SearchBarStyle = styled.input`
  flex: 1;
  border: none;
  background-color: ${({ theme }) => theme.palette.background.input};
  color: ${({ theme }) => theme.palette.text.muted};
  font-size: ${({ theme }) => theme.spacing.two.spacing};
  ::placeholder {
    color: ${({ theme }) => theme.palette.text.muted};
  }
  &:focus-visible {
    outline: none;
  }
`;

export const SearchBar: FC<SearchBarProps> = ({ placeholder }) => (
  <SearchContainer>
    <SearchIcon>
      <Image src={searchIcon} alt="Verify Coin" width="25px" height="20px" />
    </SearchIcon>
    <SearchBarStyle placeholder={placeholder} />
  </SearchContainer>
);
