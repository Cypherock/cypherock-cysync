import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useTheme } from 'styled-components';

import {
  DropdownContainer,
  DropdownListItem,
  IconContainer,
  List,
} from './DropdownStyles';

import lodash from 'lodash';
import {
  searchIcon,
  triangleGreyIcon,
  triangleInverseIcon,
} from '../../../assets';
import { Image, Input } from '../../atoms';
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
}

interface SingleSelectDropdownProps extends DropdownProps {
  onChange?: (selectedItemId: string | undefined) => void;
  isMultiSelect?: false;
  defaultValue?: string | undefined | null;
}

interface MultiSelectDropdownProps extends DropdownProps {
  onChange?: (selectedItemIds: string[]) => void;
  isMultiSelect: true;
  defaultValue?: (string | undefined | null)[];
}

export const Dropdown: React.FC<
  SingleSelectDropdownProps | MultiSelectDropdownProps
> = ({
  items,
  searchText,
  noLeftImageInList,
  placeholderText,
  disabled = false,
  leftImage,
  ...props
}) => {
  const [search, setSearch] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  const [selectedItems, setSelectedItems] = useState<string[]>(
    lodash.compact(
      props.isMultiSelect ? props.defaultValue : [props.defaultValue],
    ),
  );

  const listRef = useRef<HTMLUListElement | null>(null);

  const handleCheckedChange = (id: string) => {
    if (!props.isMultiSelect) {
      toggleDropdown();
      setSelectedItems([id]);
      props.onChange?.(id);
      return;
    }

    if (selectedItems.includes(id))
      selectedItems.splice(selectedItems.indexOf(id), 1);
    else selectedItems.push(id);
    setSelectedItems([...selectedItems]);

    props.onChange?.(selectedItems);
  };

  const selectedDropdownItem: DropDownItemProps[] = useMemo(
    () =>
      lodash.compact(
        selectedItems.map(itemId => items.find(item => item.id === itemId)),
      ),
    [items, selectedItems],
  );

  const filteredItems = useMemo(
    () => searchInItems(items, search),
    [items, search],
  );

  const handleInputChange = (value: string) => {
    if (!isOpen) toggleDropdown();
    setSearch(value);
  };

  const toggleDropdown = () => {
    if (disabled) return;
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    } else {
      setSearch('');
      containerRef.current?.focus();
    }
  }, [isOpen]);

  const handleDropDownContainerClick = () => {
    if (isOpen) return;
    toggleDropdown();
  };

  const containerRef = useRef<HTMLDivElement | null>(null);
  const theme = useTheme();

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

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

  const selectionCount = selectedDropdownItem.length;

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
        items,
        focusedIndex,
        handleCheckedChange,
        filteredItems,
        listRef,
      )}
      tabIndex={disabled ? -1 : 0}
    >
      {selectedDropdownItem[0] && !isOpen ? (
        <DropDownItem
          {...selectedDropdownItem[0]}
          $borderRadius={8}
          checked={selectionCount > 0}
          onCheckedChange={() =>
            handleCheckedChange(selectedDropdownItem[0].id ?? '')
          }
          onClick={toggleDropdown}
          $restrictedItem
          text={selectedDropdownItem[0].text}
          leftImage={selectedDropdownItem[0].leftImage}
          rightText={selectedDropdownItem[0].rightText}
          $hasRightText={!!selectedDropdownItem[0].rightText}
          $parentId={selectedDropdownItem[0].$parentId}
          tag={selectionCount > 1 ? `+${selectionCount - 1}` : undefined}
          color="white"
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
            items,
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

      {isOpen && (
        <List
          ref={listRef}
          disabled={disabled}
          id="dropdown-list"
          role="listbox"
          aria-multiselectable={false}
          aria-labelledby="dropdown-label"
        >
          {filteredItems.map((item, index) => {
            const itemId = item.id ?? '';
            const isItemFocused = focusedIndex === index;
            const isItemSelected = selectedItems.includes(itemId);
            return (
              <DropdownListItem
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
          })}
        </List>
      )}
    </DropdownContainer>
  );
};
