import lodash from 'lodash';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
// import * as Virtualize from 'react-virtualized/dist/umd/react-virtualized';
import { useTheme } from 'styled-components';

import {
  // DropDownListContainer,
  DropdownContainer,
  IconContainer
} from './DropdownStyles';

import {
  searchIcon,
  triangleGreyIcon,
  triangleInverseIcon
} from '../../../assets';
import { Image, Input } from '../../atoms';
import {
  handleKeyDown,
  searchInItems
} from '../../utils';
import { DropDownItem, DropDownItemProps } from '../DropDownItem';
import { MultiSelectDropdownMenuProps, SingleSelectDropdownMenuProps } from './DropdownMenu';
import { FloatingMenu } from './FloatingMenu';

interface DropdownProps {
  searchText: string;
  placeholderText: string;
  leftImage?: React.ReactNode;
}

export const Dropdown: React.FC<
  DropdownProps & (SingleSelectDropdownMenuProps | MultiSelectDropdownMenuProps)
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

    const toggleDropdown = useCallback(() => {
      if (disabled) return;
      setIsOpen(!isOpen);
    }, [isOpen, disabled]);

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

    const selectionCount = selectedItemIdsSet.size;

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
          filteredItems,
        )}
        tabIndex={disabled ? undefined : tabIndex ?? 0}
      >
        <FloatingMenu
          {...props}
          items={filteredItems}
          maxVisibleItemCount={4}
          placement="bottom"
          isOpen={isOpen}
          setIsOpen={setIsOpen}
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
                filteredItems,
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
        </FloatingMenu>
      </DropdownContainer>
    );
  };
