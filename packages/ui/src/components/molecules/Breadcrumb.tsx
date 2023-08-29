import React, { FC, useEffect, useRef } from 'react';
import styled from 'styled-components';

import { ListItemDropdown } from '..';
import { DropdownArrow } from '../../assets';
import { Flex, Typography } from '../atoms';

export interface BreadcrumbDropdownItem {
  id: string;
  text: string;
  checkType?: string;
}

export interface BreadcrumbProps {
  currentPage: string;
  breadcrumb?: string;
  dropdown?: BreadcrumbDropdownItem[];
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  focusedIndex: number;
  setFocusedIndex: React.Dispatch<React.SetStateAction<number>>;
  selectedItem: string;
  setSelectedItem: (id: string) => void;
  dropdownState: () => void;
}

const CustomTypography = styled(Typography)`
  color: ${({ theme }) => theme.palette.background.breadcrumbSeparator};
`;

const DropDownWrapper = styled.div`
  position: relative;
  cursor: pointer;
  display: flex;
  gap: 12px;
  align-items: center;
`;

const DropdownContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const ListItemWrapper = styled.div`
  display: inline-flex;
  position: absolute;
  z-index: 1000;
  padding: 24px 0px;
  flex-direction: column;
  align-items: flex-start;
  border-radius: 8px;
  background: ${({ theme }) => theme.palette.background.separatorSecondary};
  width: 276px;
  height: 240px;
  top: calc(100% + 10px);
  left: 0;
`;

export const Breadcrumb: FC<BreadcrumbProps> = ({
  currentPage,
  breadcrumb,
  dropdown,
  isOpen,
  setIsOpen,
  focusedIndex,
  setFocusedIndex,
  selectedItem,
  setSelectedItem,
  dropdownState,
}) => {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);

  const handleRadioCheckChange = (itemId: string) => {
    setSelectedItem(itemId);
    setIsOpen(!isOpen);
  };

  const closeDropdown = () => {
    setIsOpen(false);
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      closeDropdown();
    }

    if (isOpen) {
      if (event.key === 'Enter') {
        if (dropdown) {
          const focusedItem = dropdown[focusedIndex];
          setSelectedItem(focusedItem.id);
          setIsOpen(false);
        }
      }
      if (event.key === 'ArrowDown') {
        event.preventDefault();
        setFocusedIndex(prevIndex =>
          Math.min(prevIndex + 1, dropdown!.length - 1),
        );
      }
      if (event.key === 'ArrowUp') {
        event.preventDefault();
        setFocusedIndex(prevIndex => Math.max(prevIndex - 1, 0));
      }
    }
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Element) &&
      buttonRef.current &&
      !buttonRef.current.contains(event.target as Element)
    ) {
      closeDropdown();
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (isOpen && focusedIndex >= 0) {
      const element = document.getElementById(
        `item-${dropdown![focusedIndex].id}`,
      );
      element?.focus();
    }
  }, [focusedIndex, isOpen, dropdown]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, dropdown, focusedIndex]);

  useEffect(() => {
    if (!isOpen) {
      setFocusedIndex(-1);
    }
  }, [isOpen]);

  return (
    <Flex direction="column" gap={20} justify="center">
      <DropdownContainer>
        <Flex gap={12} align="center">
          <Typography $fontSize={16} $fontWeight="medium" color="muted">
            {currentPage}
          </Typography>
          {breadcrumb ? (
            <DropDownWrapper ref={buttonRef} onClick={dropdownState}>
              <CustomTypography $fontSize={16} $fontWeight="medium">
                /
              </CustomTypography>
              <Flex gap={16} align="center">
                <Typography $fontSize={16} $fontWeight="medium">
                  {breadcrumb}
                </Typography>
                <DropdownArrow />
              </Flex>
            </DropDownWrapper>
          ) : undefined}
        </Flex>
        {isOpen && dropdown?.length && (
          <ListItemWrapper ref={dropdownRef}>
            {dropdown.map((item, index) => (
              <ListItemDropdown
                key={item.id}
                text={item.text}
                checkType={item.checkType}
                checked={selectedItem === item.id}
                onChange={() => handleRadioCheckChange(item.id)}
                focused={index === focusedIndex}
                id={item.id}
              />
            ))}
          </ListItemWrapper>
        )}
      </DropdownContainer>
    </Flex>
  );
};

Breadcrumb.defaultProps = {
  breadcrumb: undefined,
  dropdown: [],
};
