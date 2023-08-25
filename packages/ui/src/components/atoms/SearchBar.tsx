import React, { FC } from 'react';
import styled from 'styled-components';
import SearchIcon from '../../assets/icons/generated/SearchIcon';
import { Container } from './Container';
import { svgGradients } from '../GlobalStyles';
import { CloseButton } from './CloseButton';

interface SearchBarProps {
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClear?: () => void;
  $borderGold?: boolean;
}

const SearchContainer = styled.div<{ $borderGold?: boolean }>`
  display: flex;
  position: relative;
  align-items: center;
  padding: 12px 24px;
  height: 44px;
  width: 693px;
  @media (max-width: 1440px) {
    width: 240px;
  }
  gap: 24px;
  background-color: ${({ theme }) =>
    theme.palette.background.separatorSecondary};
  border: 1px solid ${({ theme }) => theme.palette.border.separator};
  ${({ theme, $borderGold }) =>
    $borderGold &&
    `
    &::before {
      content: '';
      position: absolute;
      inset: 0;
      border: 1px solid transparent;
      border-radius:8px;
      background: ${theme.palette.golden} border-box;
      -webkit-mask: linear-gradient(#fff 0 0) padding-box,
        linear-gradient(#fff 0 0);
      -webkit-mask-composite: xor;
      mask-composite: exclude;
    }
  `};
  border-radius: ${({ theme }) => theme.spacing.one.spacing};
`;

export const SearchBarStyle = styled.input<SearchBarProps>`
  flex: 1;
  position: relative;
  z-index: 2;
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
  width: 100%;
`;

export const SearchBar: FC<SearchBarProps> = ({
  placeholder,
  value,
  onChange,
  onClear,
  $borderGold,
}) => {
  const handleClearInput = () => {
    if (onClear) {
      onClear();
    }
  };
  return (
    <SearchContainer $borderGold={$borderGold}>
      <Container display="flex" align="center">
        <SearchIcon
          width="25px"
          height="20px"
          stroke={$borderGold ? `url(#${svgGradients.gold})` : undefined}
        />
      </Container>
      <SearchBarStyle
        value={value}
        placeholder={placeholder}
        onChange={onChange}
      />
      {value !== '' && (
        <CloseButton
          onClick={handleClearInput}
          width="10px"
          height="10px"
          $zIndex={1}
        />
      )}
    </SearchContainer>
  );
};

SearchBar.defaultProps = {
  onClear: undefined,
  $borderGold: undefined,
};
