import React, { FC } from 'react';
import styled, { css } from 'styled-components';

import { CrossMark, SearchIcon } from '../../../assets';
import { Input, Typography } from '../../atoms';
import { goldenGradient, utils, UtilsProps } from '../../utils';

export interface TableSearchProps {
  placeholder?: string;
  heading?: string;
  value: string;
  onChange: (value: string) => void;
  $borderGold?: boolean;
}

export const TableStructure = styled.div<{ $noMargin?: boolean } & UtilsProps>`
  transition: max-height 0.3s ease-out;
  box-shadow: ${({ theme }) => theme.palette.shadow.popup};
  border-top-left-radius: 24px;
  border-top-right-radius: 24px;
  border-bottom-right-radius: 24px;
  border-bottom-left-radius: 24px;
  background: ${({ theme }) => theme.palette.primary.primary};
  ${({ $noMargin }) =>
    !$noMargin &&
    `
      margin-top: 20px;
      margin-left: 20px;
      margin-right: 20px;
      margin-bottom: 20px;
    `}
  ${utils}
`;

const TableTitleSearch = styled.div`
  display: flex;
  align-items: center;
  padding: 16px 40px;
  @media ${({ theme }) => theme.screens.md} {
    padding: 16px 24px;
  }
  border-top-left-radius: 24px;
  border-top-right-radius: 24px;
  overflow: hidden;
  gap: 48px;
  background: ${({ theme }) => theme.palette.background.primary};
  border-bottom: 1px solid ${({ theme }) => theme.palette.border.table.title};
`;

const SearchWrapper = styled.div<Pick<TableSearchProps, '$borderGold'>>`
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
  placeholder,
  heading,
  value,
  onChange,
  $borderGold = false,
}) => (
  <TableTitleSearch>
    {heading && (
      <OverflowTypography $fontSize={20} $fontWeight="medium" color="muted">
        {heading}
      </OverflowTypography>
    )}
    <SearchWrapper $borderGold={$borderGold}>
      <Input
        value={value}
        leftImage={<SearchIcon stroke={$borderGold ? undefined : 'white'} />}
        placeholder={placeholder}
        type="text"
        name="search"
        $customImageSpacing
        onChange={onChange}
        postfixIcon={value ? <CrossMark /> : undefined}
        onPostfixIconClick={() => onChange('')}
      />
    </SearchWrapper>
  </TableTitleSearch>
);

TableSearch.defaultProps = {
  placeholder: undefined,
  heading: undefined,
  $borderGold: false,
};
