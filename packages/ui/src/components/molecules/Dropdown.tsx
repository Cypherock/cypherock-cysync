import React, { Dispatch, FC, SetStateAction } from 'react';

import { CheckBox, Flex } from '../atoms';

export type DropdownItems = { label: string; checked: boolean }[];

export const Dropdown: FC<{
  items: DropdownItems;
  setSelectedItems: Dispatch<SetStateAction<DropdownItems>>;
}> = ({ items, setSelectedItems }) => {
  const onSelectOption = (index: number) => {
    setSelectedItems(prevProps =>
      prevProps.map((prevProp, currentIndex) =>
        currentIndex === index
          ? { ...prevProp, checked: !prevProp.checked }
          : prevProp,
      ),
    );
  };

  return (
    <Flex
      direction="column"
      py={2}
      width="full"
      $bgColor="separatorSecondary"
      $borderRadius={8}
      $borderWidth={0}
    >
      {items.map((item, index) => (
        <Flex
          $borderWidthB={1}
          $borderColor="popup"
          px={3}
          py="12"
          key={`checkbox-${index + 1}`}
          gap={24}
          align="center"
        >
          <CheckBox
            id={`checkbox-${index + 1}`}
            onChange={() => onSelectOption(index)}
            checked={item.checked}
            label={item.label}
          />
        </Flex>
      ))}
    </Flex>
  );
};
