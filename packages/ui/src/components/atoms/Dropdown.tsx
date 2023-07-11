import React, { useState } from 'react';
import styled from 'styled-components';

import { Image } from './Image';
import { Input } from './Input';

import {
  cypherockRedIcon,
  searchIcon,
  triangleInverseIcon,
} from '../../assets';
import { LeanBoxProps, TempListItem } from '../molecules';

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
  &:hover {
    background-color: #272320;
  }
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

interface DropdownProps {
  items: LeanBoxProps[];
  shouldChangeColor?: boolean;
}

export const Dropdown: React.FC<DropdownProps> = ({
  items,
  shouldChangeColor,
}) => {
  const [search, setSearch] = useState('');
  const [selectedItem, setSelectedItem] = useState<LeanBoxProps | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredItemId, setHoveredItemId] = useState<any | null>(null);

  const filteredItems = items.filter(item =>
    item.text.toLowerCase().includes(search.toLowerCase()),
  );

  const handleInputChange = (value: string) => {
    setSearch(value);
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
    setSearch('');
  };

  const handleItemSelection = (item: LeanBoxProps) => {
    setSelectedItem(item);
    toggleDropdown();
  };

  return (
    <Container isOpen={isOpen}>
      {selectedItem ? (
        <TempListItem
          {...selectedItem}
          onClick={toggleDropdown}
          restrictedItem
          shouldChangeColor={shouldChangeColor}
          leftImageSrc={
            shouldChangeColor ? cypherockRedIcon : selectedItem?.leftImageSrc
          }
        />
      ) : (
        <Input
          type="text"
          value={search}
          name="choose"
          onClick={toggleDropdown}
          onChange={handleInputChange}
          bgColor="#272320"
          placeholder={isOpen ? 'Search' : 'Choose a coin'}
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
          {filteredItems.map(item => (
            <ListItem
              key={item.id}
              onClick={() => handleItemSelection(item)}
              onMouseEnter={() => setHoveredItemId(item.id)}
              onMouseLeave={() => setHoveredItemId(null)}
            >
              <TempListItem
                {...item}
                selectedItem={selectedItem}
                isHovered={item.id === hoveredItemId}
              />
            </ListItem>
          ))}
        </List>
      )}
    </Container>
  );
};

Dropdown.defaultProps = {
  shouldChangeColor: false,
};
