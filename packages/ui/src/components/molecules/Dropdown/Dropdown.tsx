import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useTheme } from 'styled-components';

import {
  DropdownContainer,
  DropdownListItem,
  IconContainer,
  List,
} from './DropdownStyles';

import {
  searchIcon,
  triangleGreyIcon,
  triangleInverseIcon,
} from '../../../assets';
import { Image, Input } from '../../atoms';
import {
  findSelectedItem,
  handleClickOutside,
  handleEscapeKey,
  handleKeyDown,
  searchInItems,
} from '../../utils';
import { DropDownListItem, DropDownListItemProps } from '../DropDownListItem';

interface DropdownProps {
  items: DropDownListItemProps[];
  searchText: string;
  placeholderText: string;
  noLeftImageInList?: boolean;
  selectedItem: string | undefined;
  onChange: (selectedItemId: string | undefined) => void;
  disabled?: boolean;
  leftImage?: React.ReactNode;
}

export const Dropdown: React.FC<DropdownProps> = ({
  items,
  searchText,
  noLeftImageInList,
  placeholderText,
  selectedItem = undefined,
  onChange,
  disabled = false,
  leftImage,
}) => {
  const [search, setSearch] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const listRef = useRef<HTMLUListElement | null>(null);
  const handleCheckedChange = (id: string) => {
    onChange(id);
  };

  const selectedDropdownItem = useMemo(
    () => findSelectedItem(items, selectedItem),
    [items, selectedItem],
  );

  const filteredItems = useMemo(
    () => searchInItems(items, search),
    [items, search],
  );

  const handleInputChange = (value: string) => {
    setSearch(value);
  };

  const toggleDropdown = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
      setSearch('');
    }
  };

  const handleItemSelection = () => {
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
    const escapeKeyHandler = handleEscapeKey(isOpen, setIsOpen, containerRef);

    const clickOutsideHandler = handleClickOutside(setIsOpen, containerRef);

    window.addEventListener('keydown', escapeKeyHandler);
    window.addEventListener('click', clickOutsideHandler);

    return () => {
      window.removeEventListener('keydown', escapeKeyHandler);
      window.removeEventListener('click', clickOutsideHandler);
    };
  }, [isOpen, setIsOpen, containerRef]);

  return (
    <DropdownContainer
      ref={containerRef}
      $isOpen={isOpen || isHovered}
      disabled={disabled}
      onClick={toggleDropdown}
      onMouseEnter={() => setIsHovered(true)}
      onKeyDown={handleKeyDown(
        isOpen,
        toggleDropdown,
        setFocusedIndex,
        items,
        focusedIndex,
        setSelectedIndex,
        handleCheckedChange,
        filteredItems,
        listRef,
        containerRef,
      )}
      tabIndex={disabled ? -1 : 0}
    >
      {selectedDropdownItem && !isOpen ? (
        <DropDownListItem
          {...selectedDropdownItem}
          $borderRadius={8}
          checked={!!selectedItem || false}
          onCheckedChange={() =>
            handleCheckedChange(selectedDropdownItem.id ?? '')
          }
          onClick={toggleDropdown}
          $restrictedItem
          leftImage={selectedDropdownItem.leftImage}
          rightText={selectedDropdownItem.rightText}
          $hasRightText={!!selectedDropdownItem.rightText}
          $parentId={selectedDropdownItem.$parentId}
          color="white"
        />
      ) : (
        <Input
          type="text"
          ref={inputRef}
          value={search}
          name="choose"
          onClick={toggleDropdown}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown(
            isOpen,
            toggleDropdown,
            setFocusedIndex,
            items,
            focusedIndex,
            setSelectedIndex,
            handleCheckedChange,
            filteredItems,
            listRef,
            containerRef,
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
            const isItemSelected = selectedIndex === index;
            return (
              <DropdownListItem
                key={itemId}
                onClick={handleItemSelection}
                role="option"
                aria-selected={isItemSelected}
                onMouseEnter={() => setFocusedIndex(index)}
                onFocus={() => setFocusedIndex(index)}
                $isFocused={isItemFocused}
              >
                <DropDownListItem
                  {...item}
                  checked={selectedItem === item.id}
                  onCheckedChange={handleCheckedChange}
                  id={item.id}
                  leftImage={noLeftImageInList ? undefined : item.leftImage}
                  $isFocused={isItemFocused}
                />
              </DropdownListItem>
            );
          })}
        </List>
      )}
    </DropdownContainer>
  );
};

Dropdown.defaultProps = {
  disabled: false,
  noLeftImageInList: false,
  leftImage: undefined,
};
