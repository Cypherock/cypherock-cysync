import React, { FC } from 'react';
import styled from 'styled-components';

import { CloseButton } from './CloseButton';
import { Container } from './Container';
// No longer need to import SearchIcon from generated assets
// import SearchIcon from '../../assets/icons/generated/SearchIcon';
import { svgGradients } from '../GlobalStyles'; // Keep this for gradient IDs
import { UtilsProps, utils } from '../utils';

interface SearchBarProps extends UtilsProps {
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  $goldBorder?: boolean; // This prop controls if the border and icon are golden
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
  border: 1px solid
    ${({ theme, $goldBorder }) =>
      $goldBorder
        ? 'transparent'
        : theme.palette.border
            .separator}; // Border transparent if gold gradient applied
  ${({ theme, $goldBorder }) =>
    $goldBorder &&
    `
    &::before {
      content: '';
      position: absolute;
      inset: 0;
      border: 1px solid transparent;
      border-radius: 8px; /* Match SearchContainer's border-radius */
      background: ${theme.palette.golden} border-box; /* theme.palette.golden is already conditional */
      -webkit-mask: linear-gradient(#fff 0 0) padding-box,
        linear-gradient(#fff 0 0);
      -webkit-mask-composite: xor;
      mask-composite: exclude;
    }
  `};
  border-radius: ${({ theme }) => theme.spacing.one.spacing}; // 8px
  ${utils}
`;

const SearchBarStyle = styled.input`
  // Removed SearchBarProps from here as they are on SearchContainer
  flex: 1;
  position: relative;
  z-index: 2;
  border: none;
  background-color: transparent; // Make input background transparent to see SearchContainer's bg
  color: ${({ theme }) => theme.palette.text.muted};
  font-size: ${({ theme }) => theme.spacing.two.spacing}; /* 16px */
  ::placeholder {
    color: ${({ theme }) => theme.palette.text.muted};
  }
  &:focus-visible {
    outline: none;
  }
  width: 100%;
`;

// Define the SVG Icon component directly within SearchBar.tsx
const DynamicSearchIcon: FC<{ strokeUrl: string }> = ({ strokeUrl }) => (
  <svg
    width="25"
    height="20"
    viewBox="0 0 25 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M21.1901 18.6896L17.0865 14.5787M19.3606 9.08483C19.3606 11.147 18.5414 13.1246 17.0833 14.5828C15.6251 16.0409 13.6474 16.8601 11.5853 16.8601C9.52319 16.8601 7.54553 16.0409 6.08738 14.5828C4.62924 13.1246 3.81006 11.147 3.81006 9.08483C3.81006 7.02271 4.62924 5.04504 6.08738 3.58689C7.54553 2.12875 9.52319 1.30957 11.5853 1.30957C13.6474 1.30957 15.6251 2.12875 17.0833 3.58689C18.5414 5.04504 19.3606 7.02271 19.3606 9.08483V9.08483Z"
      stroke={strokeUrl} // Use the passed strokeUrl
      strokeWidth="2"
      strokeLinecap="round"
    />
    {/* Defs are not needed here if svgGradients.gold/odixPrimary are globally defined in GlobalStyles.tsx */}
  </svg>
);

export const SearchBar: FC<SearchBarProps> = props => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { placeholder, value, onChange, $goldBorder } = props;

  const handleClearInput = () => {
    onChange('');
  };

  // Determine which gradient ID to use for the icon's stroke
  const strokeGradientId = React.useMemo(() => {
    const isOdix =
      typeof window !== 'undefined' &&
      (window as any).cysyncEnv?.VENDOR === 'odix';
    return isOdix ? svgGradients.odixPrimary : svgGradients.gold;
  }, []);

  return (
    <SearchContainer {...{ ...props, onChange: undefined }}>
      <Container display="flex" align="center">
        <DynamicSearchIcon strokeUrl={`url(#${strokeGradientId})`} />
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
  $goldBorder: false, // Default to not having the gold border/icon
};
