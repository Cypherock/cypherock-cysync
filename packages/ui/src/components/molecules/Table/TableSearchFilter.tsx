import React, { FC } from 'react';
import styled from 'styled-components';

import { Flex, SearchBar } from '../../atoms';
import { Calendar } from '../Calendar';

interface SearchFilterProps {
  placeholder: string;
  value: string | undefined;
  onChange: (value: any) => void;
}

const SearchContainer = styled.div`
  display: flex;
  padding: 16px 40px;
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
  value,
  onChange,
}) => (
  <SearchContainer>
    <Flex align="center" gap={8}>
      <SearchBar placeholder={placeholder} />
    </Flex>
    <Flex align="center" direction="row" gap={8}>
      <Calendar value={value} onChange={onChange} />
    </Flex>
  </SearchContainer>
);
