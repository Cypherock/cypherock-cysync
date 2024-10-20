import React, { FC } from 'react';
import styled, { useTheme } from 'styled-components';

import { DownloadCsv } from '../../../assets';
import { Flex, SearchBar, Tooltip } from '../../atoms';

interface SearchFilterProps {
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  handleDownloadCSV?: () => void;
  downloadCSVDisabled?: boolean;
  downloadCSVTooltip: string;
}

const SearchContainer = styled.div`
  display: flex;
  padding: var(--16-px, 16px) 40px;
  border-radius: 24px 24px 0 0;
  justify-content: space-between;
  align-items: center;
  gap: 40px;
  align-self: stretch;
  width: 100%;
  background: ${({ theme }) => theme.palette.background.sideBar};
  border-bottom: 1px solid ${({ theme }) => theme.palette.border.table.title};
`;

export const DownloadCSVButtonStyle = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background-color: #342f2c;
  justify-content: center;
  align-items: center;
  display: flex;
  cursor: pointer;
  transition: background-color 0.3s;
  &:hover {
    background-color: #453e3a;
  }
`;

export const TableSearchFilter: FC<SearchFilterProps> = ({
  placeholder,
  value,
  onChange,
  handleDownloadCSV,
  downloadCSVDisabled,
  downloadCSVTooltip,
}) => {
  const theme = useTheme();

  return (
    <SearchContainer>
      <Flex align="center" gap={8} width="100%">
        <SearchBar
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          $goldBorder={!!value}
          width="100%"
        />
      </Flex>
      <Tooltip text={downloadCSVTooltip} tooltipPlacement="bottom">
        <DownloadCSVButtonStyle
          onClick={downloadCSVDisabled ? undefined : handleDownloadCSV}
        >
          <DownloadCsv
            fill={
              downloadCSVDisabled
                ? theme?.palette.text.disabled
                : theme?.palette.text.white
            }
          />
        </DownloadCSVButtonStyle>
      </Tooltip>
      {/* TODO: Add filter and calendar dropdown */}
    </SearchContainer>
  );
};

TableSearchFilter.defaultProps = {
  handleDownloadCSV: undefined,
  downloadCSVDisabled: false,
};
