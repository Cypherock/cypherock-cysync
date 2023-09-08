import React, { FC } from 'react';
import styled from 'styled-components';

import { Flex, SearchBar } from '../../atoms';

interface SearchFilterProps {
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
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
  value,
  onChange,
}) => (
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
    {/* TODO: Add filter and calendar dropdown */}
  </SearchContainer>
);
