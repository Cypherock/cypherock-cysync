import React, { FC, useCallback, useMemo, useState } from 'react';
import styled, { useTheme } from 'styled-components';

import { TriangleInverseIcon } from '../../../assets';
import { Flex, SearchBar, Typography } from '../../atoms';
import { DropDownItem, DropDownItemProps } from '../DropDownItem';

export interface InlineDropdownProps {
  label: string;
  items: DropDownItemProps[];
  selectedIds: string[];
  onChange: (ids: string[]) => void;
  showSearch?: boolean;
  searchPlaceholder?: string;
  defaultExpanded?: boolean;
  noDataText?: string;
  $maxBodyHeight?: number;
  $itemLeftPadding?: string;
}

const HeaderRow = styled.div`
  display: flex;
  align-items: center;
  align-self: stretch;
  gap: 16px;
  padding: 12px 24px;
  cursor: pointer;
  user-select: none;
  background: ${({ theme }) => theme.palette.background.sideBar};
  border-bottom: 1px solid ${({ theme }) => theme.palette.border.list};
`;

const ChevronWrapper = styled.div<{ $expanded: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.15s ease;
  transform: rotate(${({ $expanded }) => ($expanded ? '0deg' : '-90deg')});
`;

const SearchBarWrapper = styled.div`
  padding: 10px 14px;
`;

const ItemsListWrapper = styled.div<{ $maxBodyHeight?: number }>`
  ${({ $maxBodyHeight }) =>
    $maxBodyHeight ? `max-height: ${$maxBodyHeight}px; overflow-y: auto;` : ''}
`;

export const InlineDropdown: FC<InlineDropdownProps> = ({
  label,
  items,
  selectedIds,
  onChange,
  showSearch,
  searchPlaceholder,
  defaultExpanded,
  noDataText,
  $maxBodyHeight,
  $itemLeftPadding,
}) => {
  const theme = useTheme();
  const [expanded, setExpanded] = useState(defaultExpanded ?? true);
  const [search, setSearch] = useState('');

  const selectedIdSet = useMemo(() => new Set(selectedIds), [selectedIds]);

  const filteredItems = useMemo(() => {
    if (!showSearch || !search.trim()) return items;
    const term = search.trim().toLowerCase();
    return items.filter(item => item.text.toLowerCase().includes(term));
  }, [items, search, showSearch]);

  const handleToggleItem = useCallback(
    (id: string) => {
      const next = new Set(selectedIdSet);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      onChange(Array.from(next));
    },
    [selectedIdSet, onChange],
  );

  const handleToggleExpand = useCallback(() => {
    setExpanded(prev => !prev);
  }, []);

  return (
    <>
      <HeaderRow onClick={handleToggleExpand}>
        <ChevronWrapper $expanded={expanded}>
          <TriangleInverseIcon fill={theme?.palette.text.muted} />
        </ChevronWrapper>
        <Typography variant="p" color="muted">
          {label}
        </Typography>
      </HeaderRow>
      {expanded && (
        <>
          {showSearch && (
            <SearchBarWrapper>
              <SearchBar
                placeholder={searchPlaceholder ?? ''}
                value={search}
                onChange={setSearch}
                $goldBorder={!!search}
              />
            </SearchBarWrapper>
          )}
          <ItemsListWrapper $maxBodyHeight={$maxBodyHeight}>
            {filteredItems.map(item => (
              <DropDownItem
                {...item}
                key={item.id ?? item.text}
                checkType="checkbox"
                checked={selectedIdSet.has(item.id ?? '')}
                onCheckedChange={handleToggleItem}
                $leftPadding={$itemLeftPadding ?? item.$leftPadding}
              />
            ))}
            {filteredItems.length === 0 && noDataText && (
              <Flex justify="center" align="center" py={2}>
                <Typography color="muted" variant="fineprint">
                  {noDataText}
                </Typography>
              </Flex>
            )}
          </ItemsListWrapper>
        </>
      )}
    </>
  );
};

InlineDropdown.defaultProps = {
  showSearch: false,
  searchPlaceholder: undefined,
  defaultExpanded: true,
  noDataText: undefined,
  $maxBodyHeight: undefined,
  $itemLeftPadding: undefined,
};
