import React, { useEffect, useMemo, useRef, useState } from 'react';
import styled, { useTheme } from 'styled-components';

import { Image } from './Image';
import { Input } from './Input';

import { searchIcon, triangleInverseIcon } from '../../assets';
import { DropDownListItem, DropDownListItemProps } from '../molecules';
import { findSelectedItem, searchInItems } from '../utils';

interface DropdownProps {
  items: DropDownListItemProps[];
  searchText: string;
  placeholderText: string;
  selectedItem: string | undefined;
  onChange: (selectedItemId: string | undefined) => void;
  disabled?: boolean;
}

const List = styled.ul<{ disabled?: boolean }>`
  position: absolute;
  top: 100%;
  right: 0;
  width: 100%;
  list-style: none;
  border-radius: 8px;
  box-shadow: 4px 4px 32px 4px ${({ theme }) => theme.palette.shadow.dropdown};
  padding: 16px 0px 16px 0px;
  z-index: 10;
  background-color: ${({ theme }) => theme.palette.border.list};
  &:hover {
    cursor: ${props => (!props.disabled ? 'pointer' : 'default')};
  }
`;

const ListItem = styled.li`
  background-color: ${({ theme }) => theme.palette.border.list};
`;

const buttonAnimationData = {
  duration: '0.3s',
  curve: 'ease-out',
};

const Container = styled.div<{ $isOpen: boolean; disabled?: boolean }>`
  position: relative;
  width: 100%;
  border-radius: 8px;
  background-color: ${({ theme }) => theme.palette.border.separatorSecondary};
  padding: 1px;
  ${({ disabled, theme }) =>
    !disabled &&
    `
      &:hover {  
        &::before {
            content: '';
            position: absolute;
            inset: 0;
            border-radius: 8px;
            border: 1px solid transparent;
            background: ${theme.palette.golden};
            -webkit-mask: linear-gradient(#fff 0 0) padding-box,
              linear-gradient(#fff 0 0);
            -webkit-mask-composite: xor;
            mask-composite: exclude;
          }
      
          &:hover::before {
            background: ${theme.palette.golden} border-box;
            transition: all ${buttonAnimationData.duration};
            ${buttonAnimationData.curve};
          }
        cursor: pointer;
      }      
    `}

  input {
    padding-right: 30px;
    cursor: ${({ disabled }) => (disabled ? 'default' : 'pointer')};
  }
`;

const IconContainer = styled.div`
  position: absolute;
  right: 24px;
  padding-bottom: 8px;
  top: 60%;
  transform: translateY(-50%);
`;

export const Dropdown: React.FC<DropdownProps> = ({
  items,
  searchText,
  placeholderText,
  selectedItem = undefined,
  onChange,
  disabled = false,
}) => {
  const [search, setSearch] = useState('');
  const [isOpen, setisOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleCheckedChange = (id: string) => {
    onChange(id);
  };

  const selectedDropdownItem = useMemo(
    () => findSelectedItem(items, selectedItem),
    [items, selectedItem],
  );

  const filteredItems = useMemo(
    () => searchInItems(items, search, selectedItem),
    [items, search],
  );

  const handleInputChange = (value: string) => {
    setSearch(value);
  };

  const toggleDropdown = () => {
    if (!disabled) {
      setisOpen(!isOpen);
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
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setisOpen(false);
      }
    };

    window.addEventListener('click', handleClickOutside);

    return () => {
      window.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    <Container
      ref={containerRef}
      $isOpen={isOpen || isHovered}
      disabled={disabled}
      onClick={toggleDropdown}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
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
          $bgColor={theme?.palette.background.separatorSecondary}
          placeholder={isOpen ? searchText : placeholderText}
          disabled={disabled}
        />
      )}
      <IconContainer>
        <Image
          src={isOpen ? searchIcon : triangleInverseIcon}
          alt={isOpen ? 'Search Icon' : 'Dropdown Icon'}
        />
      </IconContainer>

      {isOpen && (
        <List onMouseLeave={toggleDropdown} disabled={disabled}>
          {filteredItems.map(item => {
            const itemId = item.id ?? '';
            return (
              <ListItem key={itemId} onClick={() => handleItemSelection()}>
                <DropDownListItem
                  {...item}
                  checked={selectedItem === item.id}
                  onCheckedChange={handleCheckedChange}
                  selectedItem={selectedItem}
                  id={item.id}
                />
              </ListItem>
            );
          })}
        </List>
      )}
    </Container>
  );
};

Dropdown.defaultProps = {
  disabled: false,
};
