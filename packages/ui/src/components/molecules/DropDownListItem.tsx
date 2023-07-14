import React, { FC, ReactElement, useState } from 'react';
import styled from 'styled-components';

import {
  CheckBox,
  Image,
  RadioButton,
  Tag,
  Typography,
  TypographyColor,
  TypographyProps,
} from '../atoms';
import { theme } from '../../themes/theme.styled';

export interface DropDownListItemProps {
  leftImageSrc?: string;
  rightIconSrc?: string;
  rightText?: string;
  tag?: string;
  text: string;
  displayRadioButton?: boolean;
  radioButtonValue?: string;
  restrictedItem?: boolean;
  rightTextColor?: TypographyColor;
  textVariant?: TypographyProps['variant'];
  rightTextVariant?: TypographyProps['variant'];
  showCheckBox?: boolean;
  id?: string;
  onClick?: () => void;
  selectedItem?: string | null;
  changeColorWhite?: boolean;
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

export interface DropDownListItemHorizontalBoxProps {
  isChecked: boolean;
}

export const DropDownListItemHorizontalBox = styled.div<DropDownListItemHorizontalBoxProps>`
  display: flex;
  padding: 12px 24px;
  align-items: center;
  gap: 16px;
  align-self: stretch;
  border-bottom: 1px solid #2c2824;
  background-color: ${({ isChecked }) => (isChecked ? '#272320' : '#46403c')};
  &:hover {
    background-color: #272320;
  }
`;

export const DropDownListItemIconContainer = styled.div`
  display: flex;
  align-items: center;
`;

export const DropDownListItemStretchedTypography = styled(Typography)<{
  shouldStretch: boolean;
  changeColor?: boolean;
}>`
  flex: ${({ shouldStretch }) => (shouldStretch ? '1' : 'unset')};
  color: ${({ changeColor }) =>
    changeColor ? 'white' : theme.palette.text.muted};
`;

export const DropDownListItemRightContent = styled.div`
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 16px;
`;

export const DropDownListItem: FC<DropDownListItemProps> = ({
  leftImageSrc,
  rightIconSrc,
  displayRadioButton,
  radioButtonValue,
  rightText,
  selectedItem,
  text,
  tag,
  textVariant = 'fineprint',
  rightTextVariant = 'fineprint',
  rightTextColor = 'gold',
  showCheckBox = false,
  checked = false,
  id,
  onClick,
  restrictedItem = false,
  changeColorWhite = false,
  onCheckedChange,
}): ReactElement => {
  const [isChecked, setChecked] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const handleCheckBoxChange = () => {
    const newChecked = !isChecked;
    setChecked(newChecked);

    if (onCheckedChange) {
      onCheckedChange(newChecked);
    }
  };

  const handleRadioButtonChange = () => {
    // state code to be added here
  };

  return (
    <DropDownListItemHorizontalBox
      onClick={onClick}
      isChecked={checked}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {!restrictedItem && displayRadioButton && (
        <RadioButton
          checked={selectedItem === id}
          value={radioButtonValue}
          onChange={handleRadioButtonChange}
        />
      )}
      {leftImageSrc && (
        <DropDownListItemIconContainer>
          <Image
            src={leftImageSrc}
            alt="Left Icon"
            width="20px"
            height="16px"
          />
        </DropDownListItemIconContainer>
      )}
      <DropDownListItemStretchedTypography
        shouldStretch={!tag}
        variant={textVariant}
        changeColor={changeColorWhite || isHovered}
        $fontWeight="medium"
      >
        {text}
      </DropDownListItemStretchedTypography>
      {tag && <Tag>{tag}</Tag>}
      <DropDownListItemRightContent>
        {rightText && (
          <Typography variant={rightTextVariant} color={rightTextColor}>
            {rightText}
          </Typography>
        )}
        {rightIconSrc && (
          <DropDownListItemIconContainer>
            <Image
              src={rightIconSrc}
              alt="Right Icon"
              width="15px"
              height="12px"
            />
          </DropDownListItemIconContainer>
        )}
        {!restrictedItem && showCheckBox && (
          <CheckBox
            checked={checked}
            onChange={handleCheckBoxChange}
            id={id ?? 'default-id'}
          />
        )}
      </DropDownListItemRightContent>
    </DropDownListItemHorizontalBox>
  );
};

DropDownListItem.defaultProps = {
  rightIconSrc: undefined,
  leftImageSrc: undefined,
  rightText: undefined,
  rightTextColor: 'muted',
  textVariant: 'fineprint',
  displayRadioButton: false,
  radioButtonValue: '',
  rightTextVariant: 'fineprint',
  showCheckBox: false,
  id: undefined,
  tag: undefined,
  onClick: undefined,
  restrictedItem: false,
  selectedItem: undefined,
  changeColorWhite: false,
  checked: false,
  onCheckedChange: undefined,
};
