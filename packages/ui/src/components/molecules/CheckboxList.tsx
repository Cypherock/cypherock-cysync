import React, { Dispatch, FC, SetStateAction } from 'react';

import { CheckBox, Flex } from '../atoms';

export type CheckboxListItems = {
  label: string;
  checked: boolean;
  id: string | undefined;
}[];

export const CheckboxList: FC<{
  items: CheckboxListItems;
  setSelectedItems: Dispatch<SetStateAction<CheckboxListItems>>;
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
          $borderColor="list"
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
            size="small"
            label={item.label}
          />
        </Flex>
      ))}
    </Flex>
  );
};
