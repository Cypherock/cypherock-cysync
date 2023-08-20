import React, { FC } from 'react';
import styled from 'styled-components';
import SearchIcon from '../../assets/icons/generated/SearchIcon';

interface SearchBarProps {
  placeholder: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  padding: 12px 24px;
  height: 44px;
  width: 693px;
  gap: 24px;
  background-color: ${({ theme }) =>
    theme.palette.background.separatorSecondary};
  border: 1px solid ${({ theme }) => theme.palette.border.separator};
  border-radius: ${({ theme }) => theme.spacing.one.spacing};
`;

const IconContainer = styled.div`
  display: flex;
  align-items: center;
`;

export const SearchBarStyle = styled.input<SearchBarProps>`
  flex: 1;
  border: none;
  background-color: ${({ theme }) =>
    theme.palette.background.separatorSecondary};
  color: ${({ theme }) => theme.palette.text.muted};
  font-size: ${({ theme }) => theme.spacing.two.spacing};
  ::placeholder {
    color: ${({ theme }) => theme.palette.text.muted};
  }
  &:focus-visible {
    outline: none;
  }
`;

export const SearchBar: FC<SearchBarProps> = ({ placeholder, onChange }) => (
  <SearchContainer>
    <IconContainer>
      <SearchIcon width="25px" height="20px" />
    </IconContainer>
    <SearchBarStyle placeholder={placeholder} onChange={onChange} />
  </SearchContainer>
);
