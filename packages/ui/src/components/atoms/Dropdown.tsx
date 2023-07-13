import React, { useState } from 'react';
import styled from 'styled-components';

import { Image } from './Image';
import { Input } from './Input';

import {
  cypherockRedIcon,
  searchIcon,
  triangleInverseIcon,
} from '../../assets';
import { LeanBoxProps, DropDownListItem } from '../molecules';

interface DropdownProps {
  items: LeanBoxProps[];
  shouldChangeColor?: boolean;
  searchText: string;
  placeholderText: string;
  onSelectionChange?: (selectedItemId: string | null) => void;
  disabled?: boolean;
}

const List = styled.ul`
  position: absolute;
  top: 100%;
  right: 0;
  width: 100%;
  /* min-width: 420px; */
  /* height: 192px; */
  /* padding: 16px 0; */
  list-style: none;
  background-color: #2c2520;
  border-radius: 8px;
  box-shadow: 4px 4px 32px 4px #0f0d0b;
  max-height: 200px;
  overflow-x: hidden;
  overflow-y: auto;
  z-index: 10;
  &:hover {
    background-color: #272320;
  }
`;

const ListItem = styled.li`
  background-color: #46403c;
  /* margin-left: 40px; */
`;

const Container = styled.div<{ isOpen: boolean }>`
  position: relative;
  width: 100%;
  border-radius: 8px;
  background-color: #272320;
  input {
    padding-right: 30px;
    border-color: ${props => (props.isOpen ? '#D4AF37' : '#272320')};
  }
  &:hover {
    input {
      border-color: #d4af37;
    }
    ${List} {
      background-color: #191715;
      cursor: pointer;
    }
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
  shouldChangeColor,
  searchText,
  placeholderText,
  onSelectionChange,
  disabled = false,
}) => {
  const [search, setSearch] = useState('');
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
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
      // Only allow input change when not disabled
      setSearch(value);
    }
  };

  const toggleDropdown = () => {
    if (!disabled) {
      // Only allow dropdown to toggle when not disabled
      setIsOpen(!isOpen);
      setSearch('');
    }
  };

  const handleItemSelection = (item: LeanBoxProps) => {
    const id = item.id ?? '';
    setSelectedItem(id);
    handleCheckedChange(id, true); // Update checked state when an item is selected
    toggleDropdown();
    if (onSelectionChange) {
      onSelectionChange(id); // Call the callback function with the new selected item
    }
  };

  return (
    <Container isOpen={isOpen} style={{ opacity: disabled ? 0.5 : 1 }}>
      {selectedItem ? (
        <DropDownListItem
          checked={checkedStates[selectedItem]}
          onCheckedChange={checked =>
            handleCheckedChange(selectedItem, checked)
          }
          id={selectedItem}
          text={items.find(item => item.id === selectedItem)?.text ?? ''}
          onClick={toggleDropdown}
          restrictedItem
          shouldChangeColor={shouldChangeColor}
          leftImageSrc={
            shouldChangeColor
              ? cypherockRedIcon
              : items.find(item => item.id === selectedItem)?.leftImageSrc
          }
          tag={items.find(item => item.id === selectedItem)?.tag}
        />
      ) : (
        <Input
          type="text"
          value={search}
          name="choose"
          onClick={toggleDropdown}
          onChange={handleInputChange}
          bgColor="#272320"
          placeholder={isOpen ? searchText : placeholderText}
        />
      )}
      <IconContainer>
        <Image
          src={isOpen ? searchIcon : triangleInverseIcon}
          alt={isOpen ? 'Search Icon' : 'Dropdown Icon'}
        />
      </IconContainer>

      {isOpen && (
        <List onMouseLeave={toggleDropdown}>
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
  shouldChangeColor: false,
  onSelectionChange: undefined,
  disabled: false,
};
