import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

import { Image } from './Image';
import { Input } from './Input';

import { searchIcon, triangleInverseIcon, walletIcon } from '../../assets';
import { theme } from '../../themes/theme.styled';
import { LeanBoxProps, DropDownListItem } from '../molecules';

interface DropdownProps {
  items: LeanBoxProps[];
  changeColorWhite?: boolean;
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
  box-shadow: 4px 4px 32px 4px ${theme.palette.shadow.dropdown};
  padding: 16px 0px 16px 0px;
  z-index: 10;
  background-color: ${theme.palette.background.input};
  &:hover {
    cursor: ${props => (!props.disabled ? 'pointer' : 'default')};
  }
`;

const ListItem = styled.li`
  background-color: ${theme.palette.border.list};
`;

const Container = styled.div<{ isOpen: boolean; disabled?: boolean }>`
  position: relative;
  width: 100%;
  border-radius: 8px;
  background-color: ${theme.palette.border.dropdown};
  border: 2px solid
    ${props =>
      props.isOpen ? theme.palette.border.gold : theme.palette.border.dropdown};
  &:hover {
    border: 2px solid
      ${props =>
        !props.disabled
          ? theme.palette.border.gold
          : theme.palette.border.dropdown};
  }
  input {
    padding-right: 30px;
    cursor: ${props => (props.disabled ? 'default' : 'pointer')};
  }
`;

const IconContainer = styled.div`
  position: absolute;
  right: 24px;
  top: 60%;
  transform: translateY(-50%);
`;

export const Dropdown: React.FC<DropdownProps> = ({
  items,
  changeColorWhite,
  searchText,
  placeholderText,
  selectedItem = undefined,
  onChange,
  disabled = false,
}) => {
  const [search, setSearch] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [checkedStates, setCheckedStates] = React.useState<
    Record<string, boolean>
  >({});

  const handleCheckedChange = (id: string, checked: boolean) => {
    setCheckedStates(prevStates => ({ ...prevStates, [id]: checked }));
  };

  const filteredItems = items.filter(item =>
    item.text.toLowerCase().includes(search.toLowerCase()),
  );

  const handleInputChange = (value: string) => {
    if (!disabled) {
      setSearch(value);
    }
  };

  const toggleDropdown = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
      setSearch('');
    }
  };

  const handleItemSelection = (item: LeanBoxProps) => {
    const id = item.id ?? '';
    onChange(id);
    handleCheckedChange(id, true);
    toggleDropdown();
  };
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
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
      isOpen={isOpen}
      disabled={disabled}
      onClick={toggleDropdown}
    >
      {selectedItem ? (
        <DropDownListItem
          $borderRadius={8}
          checked={checkedStates[selectedItem]}
          onCheckedChange={checked =>
            handleCheckedChange(selectedItem, checked)
          }
          id={selectedItem}
          text={items.find(item => item.id === selectedItem)?.text ?? ''}
          onClick={toggleDropdown}
          restrictedItem
          changeColorWhite
          leftImageSrc={
            changeColorWhite
              ? walletIcon
              : items.find(item => item.id === selectedItem)?.leftImageSrc
          }
          tag={items.find(item => item.id === selectedItem)?.tag}
          shortForm={items.find(item => item.id === selectedItem)?.shortForm}
        />
      ) : (
        <Input
          type="text"
          value={search}
          name="choose"
          onClick={toggleDropdown}
          onChange={handleInputChange}
          bgColor={theme.palette.background.dropdown}
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
              <ListItem key={itemId} onClick={() => handleItemSelection(item)}>
                <DropDownListItem
                  checked={checkedStates[itemId]}
                  onCheckedChange={checked =>
                    handleCheckedChange(itemId, checked)
                  }
                  {...item}
                  selectedItem={selectedItem}
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
  changeColorWhite: false,
  disabled: false,
};
