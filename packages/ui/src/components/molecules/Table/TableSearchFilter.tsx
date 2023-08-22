import React, { FC } from 'react';
import styled from 'styled-components';

import { Flex, SearchBar } from '../../atoms';
import { Calendar } from '../Calendar';
import { FilterDropdown } from '../Filter';

interface SearchFilterProps {
  placeholder: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  dateValue: string | undefined;
  dateChange: (value: string) => void;
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

export const TableSearchFilter: FC<SearchFilterProps> = ({
  placeholder,
  dateValue,
  onChange,
  dateChange,
}) => (
  <SearchContainer>
    <Flex align="center" gap={8}>
      <SearchBar placeholder={placeholder} onChange={onChange} />
    </Flex>
    <Flex align="center" direction="row" gap={16}>
      <Calendar value={dateValue} onChange={dateChange} />
      <FilterDropdown />
    </Flex>
  </SearchContainer>
);
