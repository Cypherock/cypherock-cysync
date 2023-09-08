import React, { FC, useRef, useState } from 'react';

import {
  CheckboxWrapper,
  Count,
  FilterItems,
  FilterMenu,
  FilterProps,
  FilterWrapper,
} from './FilterStyles';

import { AngleDown, AngleRight } from '../../../assets';
import { CheckBox, Flex, LangDisplay, Typography } from '../../atoms';

export const Filter: FC<FilterProps> = ({
  menu,
  subMenu,
  isToggled,
  onToggle,
  checkboxStates,
  onCheckboxChange,
  selectedCount,
  onToggleAllCheckboxes,
}) => {
  const allChecked = checkboxStates.every(Boolean);
  const itemRefs = useRef<(HTMLElement | undefined)[]>([]);
  const filterMenuCheckBoxRef = useRef<HTMLDivElement | null>(null);
  const filterMenuRef = useRef<HTMLDivElement | null>(null);

  const [clickedItemName, setClickedItemName] = useState('');
  const counter = (
    <Count>
      <Typography $fontSize={12} $fontWeight="medium" color="black">
        {selectedCount}
      </Typography>
    </Count>
  );
  const text = (
    <Typography $fontSize={12} $fontWeight="medium" color="gold">
      {clickedItemName}
    </Typography>
  );

  const handleToggleAllCheckboxesClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    if (onToggleAllCheckboxes) {
      onToggleAllCheckboxes();
    }
  };

  const renderCheckbox = () => {
    if (isToggled && !selectedCount) {
      return (
        <CheckboxWrapper
          onClick={handleToggleAllCheckboxesClick}
          ref={filterMenuCheckBoxRef}
          tabIndex={0}
        >
          <CheckBox
            checked={allChecked}
            onChange={() => {
              if (onToggleAllCheckboxes) {
                onToggleAllCheckboxes();
              }
            }}
          />
        </CheckboxWrapper>
      );
    }
    return undefined;
  };

  const renderCounterOrText = () => {
    if (menu !== 'Group By') {
      return counter;
    }
    if (selectedCount > 1 || selectedCount === 0) {
      return counter;
    }
    return text;
  };

  const handleCheck = (index: number) => {
    onCheckboxChange(index);

    const newCheckboxStates = [...checkboxStates];
    const checkedCount = newCheckboxStates.filter(Boolean).length;
    if (checkedCount === 1) {
      const checkedIndex = newCheckboxStates.findIndex(checked => checked);
      setClickedItemName(subMenu[checkedIndex].name);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const focusedIndex = itemRefs.current.findIndex(
      item => item !== undefined && item === document.activeElement,
    );

    if (document.activeElement === filterMenuCheckBoxRef.current) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        if (onToggleAllCheckboxes) {
          onToggleAllCheckboxes();
        }
      }
    }

    if (document.activeElement === filterMenuRef.current) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onToggle();
      }
    }

    if (e.key === 'ArrowDown' && focusedIndex < subMenu.length - 1) {
      itemRefs.current[focusedIndex + 1]?.focus();
    } else if (e.key === 'ArrowUp' && focusedIndex > 0) {
      itemRefs.current[focusedIndex - 1]?.focus();
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (focusedIndex >= 0) {
        handleCheck(focusedIndex);
      }
    }
  };

  return (
    <FilterWrapper onKeyDown={handleKeyDown}>
      <FilterMenu onClick={onToggle} ref={filterMenuRef} tabIndex={0}>
        <Flex gap={16} align="center">
          {isToggled ? <AngleDown /> : <AngleRight />}
          <Typography color="muted">
            <LangDisplay text={menu} />
          </Typography>
        </Flex>
        {isToggled && !selectedCount && renderCheckbox()}
        {(!isToggled || selectedCount > 0) && renderCounterOrText()}
      </FilterMenu>
      {isToggled &&
        subMenu.map((filterItem, index) => (
          <FilterItems
            key={`filterItem-${index + 1}`}
            $filterIcon={filterItem.icon}
            onClick={() => handleCheck(index)}
            checked={checkboxStates[index]}
            ref={el => {
              itemRefs.current[index] = el ?? undefined;
            }}
            tabIndex={0}
          >
            <CheckBox
              checked={checkboxStates[index]}
              onChange={() => onCheckboxChange(index)}
            />
            <Flex gap={16}>
              {filterItem.icon && filterItem.icon}
              <Typography $fontSize={14} color="muted">
                <LangDisplay text={filterItem.name} />
              </Typography>
            </Flex>
          </FilterItems>
        ))}
    </FilterWrapper>
  );
};
