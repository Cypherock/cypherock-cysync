import lodash from 'lodash';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import * as Virtualize from 'react-virtualized/dist/umd/react-virtualized';
import { useTheme } from 'styled-components';

import {
  DropDownListContainer,
  DropdownContainer,
  DropdownListItem,
  IconContainer,
} from './DropdownStyles';

import {
  NotFound,
  searchIcon,
  triangleGreyIcon,
  triangleInverseIcon,
} from '../../../assets';
import { Flex, Image, Input, LangDisplay, Typography } from '../../atoms';
import {
  handleClickOutside,
  handleEscapeKey,
  handleKeyDown,
  searchInItems,
} from '../../utils';
import { DropDownItem, DropDownItemProps } from '../DropDownItem';

interface DropdownProps {
  items: DropDownItemProps[];
  searchText: string;
  placeholderText: string;
  noLeftImageInList?: boolean;
  leftImage?: React.ReactNode;
  disabled?: boolean;
  tabIndex?: number;
  autoFocus?: boolean;
}

interface SingleSelectDropdownProps extends DropdownProps {
  onChange?: (selectedItemId: string | undefined) => void;
  isMultiSelect?: false;
  selectedItem?: string | undefined | null;
}

interface MultiSelectDropdownProps extends DropdownProps {
  onChange?: (selectedItemIds: string[]) => void;
  isMultiSelect: true;
  selectedItems?: (string | undefined | null)[];
}

export const Dropdown: React.FC<
  SingleSelectDropdownProps | MultiSelectDropdownProps
> = ({
  items: dropdownItemsList,
  searchText,
  noLeftImageInList,
  placeholderText,
  disabled = false,
  leftImage,
  tabIndex,
  autoFocus,
  ...props
}) => {
  const [search, setSearch] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [items, setItems] = useState<DropDownItemProps[]>(dropdownItemsList);

  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);

  const selectedItemIdsSet = useMemo(
    () =>
      new Set(
        lodash.compact(
          props.isMultiSelect ? props.selectedItems : [props.selectedItem],
        ),
      ),
    [
      props.isMultiSelect,
      props.isMultiSelect ? props.selectedItems : props.selectedItem,
    ],
  );

  const listRef = useRef<HTMLDivElement | null>(null);

  const onChange = useCallback(
    (ids: string[]) => {
      if (props.onChange === undefined) return;
      if (props.isMultiSelect) {
        props.onChange(ids);
      } else {
        props.onChange(ids[0]);
      }
    },
    [props.onChange, props.isMultiSelect],
  );

  const toggleDropdown = useCallback(() => {
    if (disabled) return;
    setIsOpen(!isOpen);
  }, [isOpen, disabled]);

  const handleCheckedChange = useCallback(
    (id: string) => {
      if (!props.isMultiSelect) {
        toggleDropdown();
        onChange([id]);
        return;
      }
      if (selectedItemIdsSet.has(id)) selectedItemIdsSet.delete(id);
      else selectedItemIdsSet.add(id);

      onChange(Array.from(selectedItemIdsSet));
    },
    [props.isMultiSelect, selectedItemIdsSet, onChange, toggleDropdown],
  );

  const selectedItems: DropDownItemProps[] = useMemo(
    () =>
      lodash.compact(
        items.filter(
          item =>
            item &&
            !item.disabled &&
            item.id &&
            selectedItemIdsSet.has(item.id),
        ),
      ),
    [items, selectedItemIdsSet],
  );

  const filteredItems = useMemo(
    () => searchInItems(items, search),
    [items, search],
  );

  const handleInputChange = useCallback(
    (value: string) => {
      if (!isOpen) toggleDropdown();
      setSearch(value);
      setFocusedIndex(0);
    },
    [isOpen, toggleDropdown],
  );

  const sortItems = useCallback(
    (_items: DropDownItemProps[]) => {
      if (!props.isMultiSelect) return _items;
      const _selectedItems: DropDownItemProps[] = [];
      const _unselectedItems: DropDownItemProps[] = [];
      const _disabledItems: DropDownItemProps[] = [];
      _items.forEach(item => {
        if (selectedItemIdsSet.has(item.id!)) _selectedItems.push(item);
        else if (!item.disabled) _unselectedItems.push(item);
        else _disabledItems.push(item);
      });
      return [_selectedItems, _unselectedItems, _disabledItems].flat();
    },
    [selectedItemIdsSet, props.isMultiSelect],
  );

  useEffect(() => {
    setItems(sortItems);
  }, [search]);

  const conditionallySortItems = useCallback(() => {
    if (isOpen) return;
    setItems(sortItems);
  }, [isOpen, sortItems]);

  const updateSortedItems = useCallback(
    (_dropdownItemsList: DropDownItemProps[]) => {
      const dropdownItemsMap = new Map<string | undefined, DropDownItemProps>(
        _dropdownItemsList.map(item => [item.id, item]),
      );
      return (_items: DropDownItemProps[]) => {
        if (!props.isMultiSelect) return _dropdownItemsList;

        const sortedItems = lodash.compact(
          _items.map(a => dropdownItemsMap.get(a.id)),
        );

        const includedItemIds = new Set(sortedItems.map(a => a.id));
        const aditionalItems = _dropdownItemsList.filter(
          a => !includedItemIds.has(a.id),
        );

        return [sortedItems, aditionalItems].flat();
      };
    },
    [props.isMultiSelect],
  );

  useEffect(() => {
    setItems(updateSortedItems(dropdownItemsList));
    conditionallySortItems();
  }, [dropdownItemsList, updateSortedItems, conditionallySortItems]);

  useEffect(conditionallySortItems, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    } else {
      setSearch('');
      containerRef.current?.focus();
      setFocusedIndex(null);
    }
  }, [isOpen]);

  const handleDropDownContainerClick = useCallback(() => {
    if (isOpen) return;
    toggleDropdown();
  }, [isOpen, toggleDropdown]);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const theme = useTheme();

  useEffect(() => {
    const escapeKeyHandler = handleEscapeKey(isOpen, setIsOpen);

    const clickOutsideHandler = handleClickOutside(setIsOpen, containerRef);

    window.addEventListener('keydown', escapeKeyHandler, { capture: true });
    window.addEventListener('click', clickOutsideHandler);

    return () => {
      window.removeEventListener('keydown', escapeKeyHandler, {
        capture: true,
      });
      window.removeEventListener('click', clickOutsideHandler);
    };
  }, [isOpen, setIsOpen, containerRef]);

  const selectionCount = selectedItems.length;

  const rowRenderer = useCallback(
    ({ index, style }: any) => {
      const item = filteredItems[index];
      const itemId = item.id ?? '';
      const isItemFocused: boolean = focusedIndex === index;
      const isItemSelected: boolean = selectedItemIdsSet.has(item.id!);
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
            checkType={props.isMultiSelect ? 'checkbox' : 'radio'}
            leftImage={noLeftImageInList ? undefined : item.leftImage}
            $isFocused={isItemFocused}
            disabled={item.disabled}
          />
        </DropdownListItem>
      );
    },
    [
      filteredItems,
      focusedIndex,
      selectedItemIdsSet,
      props.isMultiSelect,
      noLeftImageInList,
      handleCheckedChange,
    ],
  );

  useEffect(() => {
    setTimeout(() => {
      if (autoFocus) {
        containerRef.current?.focus();
      }
    });
  }, [autoFocus]);

  return (
    <DropdownContainer
      ref={containerRef}
      $isOpen={isOpen || isHovered}
      disabled={disabled}
      onClick={handleDropDownContainerClick}
      onMouseEnter={() => setIsHovered(true)}
      onKeyDown={handleKeyDown(
        isOpen,
        toggleDropdown,
        setFocusedIndex,
        props.isMultiSelect ?? false,
        focusedIndex,
        handleCheckedChange,
        filteredItems,
        listRef,
      )}
      tabIndex={disabled ? undefined : tabIndex ?? 0}
    >
      {selectedItems[0] && !isOpen ? (
        <DropDownItem
          {...selectedItems[0]}
          $borderRadius={8}
          checked={selectionCount > 0}
          onClick={toggleDropdown}
          $restrictedItem
          text={selectedItems[0].text}
          leftImage={selectedItems[0].leftImage}
          rightText={selectedItems[0].rightText}
          $hasRightText={!!selectedItems[0].rightText}
          $parentId={selectedItems[0].$parentId}
          tag={selectionCount > 1 ? `+${selectionCount - 1}` : undefined}
          color="white"
          tagType="gold"
          isShowCase
        />
      ) : (
        <Input
          type="text"
          ref={inputRef}
          value={search}
          name="choose"
          onChange={handleInputChange}
          onKeyDown={handleKeyDown(
            isOpen,
            toggleDropdown,
            setFocusedIndex,
            props.isMultiSelect ?? false,
            focusedIndex,
            handleCheckedChange,
            filteredItems,
            listRef,
          )}
          $bgColor={
            disabled
              ? theme?.palette.background.separatorSecondary
              : theme?.palette.background.separatorSecondary
          }
          placeholder={isOpen ? searchText : placeholderText}
          disabled={disabled}
          aria-expanded={isOpen}
          aria-owns={isOpen ? 'dropdown-list' : undefined}
          aria-haspopup="listbox"
          aria-activedescendant={
            focusedIndex !== null ? `dropdown-item-${focusedIndex}` : undefined
          }
          leftImage={leftImage}
          utilProps={{ $minHeight: '53px' }}
        />
      )}
      <IconContainer>
        {disabled ? (
          <Image src={triangleGreyIcon} alt="triangle icon" />
        ) : (
          <Image
            src={isOpen ? searchIcon : triangleInverseIcon}
            alt={isOpen ? 'Search Icon' : 'Dropdown Icon'}
          />
        )}
      </IconContainer>

      {isOpen && filteredItems.length > 0 && (
        <DropDownListContainer
          ref={listRef}
          height={53 * Math.min(filteredItems.length, 4) + 32}
          $cursor={disabled ? 'not-allowed' : 'default'}
        >
          <Virtualize.AutoSizer>
            {({ width, height }: any) => (
              <Virtualize.List
                height={height}
                width={width}
                rowCount={filteredItems.length}
                rowHeight={53}
                rowRenderer={rowRenderer}
                scrollToIndex={focusedIndex}
                overscanRowCount={10}
                style={{ outline: 'none' }}
              />
            )}
          </Virtualize.AutoSizer>
        </DropDownListContainer>
      )}

      {isOpen && filteredItems.length === 0 && (
        <DropDownListContainer $cursor="default">
          <Flex
            justify="center"
            align="center"
            direction="row"
            gap={16}
            px={3}
            py={2}
          >
            <NotFound height={22} width={22} />
            <Typography color="muted">
              <LangDisplay text="No data found" />
            </Typography>
          </Flex>
        </DropDownListContainer>
      )}
    </DropdownContainer>
  );
};
