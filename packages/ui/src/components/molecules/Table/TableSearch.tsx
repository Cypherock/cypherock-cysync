import React, { FC } from 'react';
import styled, { css } from 'styled-components';

import { CrossMark, SearchIcon } from '../../../assets';
import { Input, Typography } from '../../atoms';
import { goldenGradient } from '../../utils';

export interface TableSearchProps {
  onSearch?: (value: string) => void;
  $borderGold?: boolean;
  onPostfixIconClick?: () => void;
}

interface TableStructureProps {
  $totalHeight: number;
}

export const TableStructure = styled.div<TableStructureProps>`
  max-height: ${({ $totalHeight }) => `${$totalHeight}px`};
  overflow-y: auto;
  transition: max-height 0.3s ease-out;
  box-shadow: ${({ theme }) => theme.palette.shadow.popup};
  border-top-left-radius: 24px;
  border-top-right-radius: 24px;
  border-bottom-right-radius: 24px;
  border-bottom-left-radius: 24px;
`;

const TableTitleSearch = styled.div<TableSearchProps>`
  width: auto;
  display: flex;
  align-items: center;
  padding: 16px 40px;
  border-top-left-radius: 24px;
  border-top-right-radius: 24px;
  overflow: hidden;
  gap: 48px;
  background: ${({ theme }) => theme.palette.background.primary};
  border-bottom: 1px solid ${({ theme }) => theme.palette.border.table.title};
`;

const SearchWrapper = styled.div<TableSearchProps>`
  width: 100%;
  border-radius: 8px;
  ${({ $borderGold }) =>
    $borderGold &&
    css`
      border: 1px solid transparent;
      ${goldenGradient('background')};
    `};
`;

const OverflowTypography = styled(Typography)`
  overflow: visible;
`;

export const TableSearch: FC<TableSearchProps> = ({
  onSearch,
  $borderGold = false,
  onPostfixIconClick,
}) => (
  <TableTitleSearch>
    <OverflowTypography $fontSize={20} $fontWeight="medium" color="muted">
      Accounts
    </OverflowTypography>
    <SearchWrapper $borderGold={$borderGold}>
      <Input
        leftImage={<SearchIcon stroke={$borderGold ? undefined : 'white'} />}
        placeholder="Search"
        type="text"
        name="search"
        $customImageSpacing
        onChange={value => onSearch?.(value)}
        postfixIcon={$borderGold ? <CrossMark /> : undefined}
        onPostfixIconClick={onPostfixIconClick}
      />
    </SearchWrapper>
  </TableTitleSearch>
);

TableSearch.defaultProps = {
  onSearch: undefined,
  $borderGold: false,
  onPostfixIconClick: undefined,
};
