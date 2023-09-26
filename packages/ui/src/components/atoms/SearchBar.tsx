import React, { FC } from 'react';
import styled from 'styled-components';

import { CloseButton } from './CloseButton';
import { Container } from './Container';

import SearchIcon from '../../assets/icons/generated/SearchIcon';
import { svgGradients } from '../GlobalStyles';
import { UtilsProps, utils } from '../utils';

interface SearchBarProps extends UtilsProps {
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  $goldBorder?: boolean;
}

const SearchContainer = styled.div<{ $goldBorder?: boolean }>`
  display: flex;
  position: relative;
  align-items: center;
  padding: 12px 24px;
  height: 44px;
  gap: 24px;
  background-color: ${({ theme }) =>
    theme.palette.background.separatorSecondary};
  border: 1px solid ${({ theme }) => theme.palette.border.separator};
  ${({ theme, $goldBorder }) =>
    $goldBorder &&
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
  ${utils}
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

export const SearchBar: FC<SearchBarProps> = props => {
  const { placeholder, value, onChange, $goldBorder } = props;

  const handleClearInput = () => {
    onChange('');
  };

  return (
    <SearchContainer {...{ ...props, onChange: undefined }}>
      <Container display="flex" align="center">
        <SearchIcon
          width="25px"
          height="20px"
          stroke={$goldBorder ? `url(#${svgGradients.gold})` : undefined}
        />
      </Container>
      <SearchBarStyle
        value={value}
        placeholder={placeholder}
        onChange={e => onChange(typeof e === 'string' ? e : e.target.value)}
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
  $goldBorder: undefined,
};
