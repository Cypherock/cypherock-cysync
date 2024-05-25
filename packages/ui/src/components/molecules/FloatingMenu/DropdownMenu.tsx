import React, { useCallback, useMemo, useRef, useState } from 'react';
import * as Virtualize from 'react-virtualized/dist/umd/react-virtualized';

import { UtilsProps, handleKeyDown } from '../../utils';
import {
  DropDownListContainer,
  DropdownListItem,
} from '../Dropdown/DropdownStyles';
import { DropDownItem, DropDownItemProps } from '../DropDownItem';

export type MaxVisibleItemCount = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

export interface DropdownMenuProps {
  items: DropDownItemProps[];
  noLeftImageInList?: boolean;
  disabled?: boolean;
  tabIndex?: number;
  width?: UtilsProps['width'];
  maxVisibleItemCount?: MaxVisibleItemCount;
  selectedItem: string | undefined;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onChange?: (selectedItemId: string | undefined) => void;
}

export const DropdownMenu: React.FC<DropdownMenuProps> = ({
  items,
  noLeftImageInList,
  disabled = false,
  tabIndex,
  width: dropdownWidth,
  maxVisibleItemCount = 4,
  selectedItem,
  isOpen,
  setIsOpen,
  onChange,
}) => {
  const [focusedIndex, setFocusedIndex] = useState<number | null>(
    Math.max(
      items.findIndex(item => item.id === selectedItem),
      0,
    ),
  );

  const listRef = useRef<HTMLDivElement | null>(null);

  const toggleDropdown = useCallback(() => {
    if (disabled) return;
    setIsOpen(!isOpen);
  }, [isOpen, disabled]);

  const handleCheckedChange = useCallback(
    (id: string) => {
      if (disabled) return;
      toggleDropdown();
      if (onChange) onChange(id);
    },
    [onChange, toggleDropdown],
  );

  const rowRenderer = useCallback(
    ({ index, style }: any) => {
      const item = items[index];
      const itemId = item.id ?? '';
      const isItemFocused: boolean = focusedIndex === index;
      const isItemSelected: boolean = item.id === selectedItem;

      return (
        <DropdownListItem
          style={style}
          key={itemId}
          role="option"
          aria-selected={isItemSelected}
          onMouseEnter={() => setFocusedIndex(index)}
          onFocus={() => setFocusedIndex(index)}
          $isFocused={isItemFocused}
          $cursor={item.disabled ? 'not-allowed' : 'pointer'}
        >
          <DropDownItem
            {...item}
            checked={isItemSelected}
            onCheckedChange={handleCheckedChange}
            id={item.id}
            checkType={item.checkType}
            leftImage={noLeftImageInList ? undefined : item.leftImage}
            $isFocused={isItemFocused}
            disabled={item.disabled}
          />
        </DropdownListItem>
      );
    },
    [items, focusedIndex, selectedItem, noLeftImageInList, handleCheckedChange],
  );

  if (!isOpen) return null;
  if (items.length === 0) return null;

  const baseHeight = useMemo(
    () =>
      items.some(item => item.showRightTextOnBottom && item.rightText)
        ? 69
        : 53,
    [items],
  );

  return (
    <DropDownListContainer
      ref={listRef}
      height={baseHeight * Math.min(items.length, maxVisibleItemCount) + 32}
      $cursor={disabled ? 'not-allowed' : 'default'}
      tabIndex={disabled ? undefined : tabIndex ?? 0}
      width={dropdownWidth}
      $isSelfPositioned
      onKeyDown={handleKeyDown(
        isOpen,
        toggleDropdown,
        setFocusedIndex,
        false,
        focusedIndex,
        handleCheckedChange,
        items,
        listRef,
      )}
    >
      <Virtualize.AutoSizer>
        {({ width, height }: any) => (
          <Virtualize.List
            height={height}
            width={width}
            rowCount={items.length}
            rowHeight={baseHeight}
            rowRenderer={rowRenderer}
            scrollToIndex={focusedIndex}
            overscanRowCount={10}
            style={{ outline: 'none' }}
          />
        )}
      </Virtualize.AutoSizer>
    </DropDownListContainer>
  );
};

DropdownMenu.defaultProps = {
  noLeftImageInList: undefined,
  disabled: undefined,
  tabIndex: undefined,
  width: undefined,
  maxVisibleItemCount: undefined,
  onChange: undefined,
};
