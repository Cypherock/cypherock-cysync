import React, { FC, ReactElement, useState } from 'react';
import styled from 'styled-components';

import {
  CheckBox,
  Image,
  LangDisplay,
  RadioButton,
  Tag,
  Typography,
  TypographyColor,
  TypographyProps,
} from '../atoms';
import { theme } from '../../themes/theme.styled';
import { BorderProps, border } from '../utils';

export interface DropDownListItemProps extends BorderProps {
  leftImageSrc?: string;
  rightIconSrc?: string;
  rightText?: string;
  tag?: string;
  text: string;
  displayRadioButton?: boolean;
  radioButtonValue?: string;
  restrictedItem?: boolean;
  rightTextColor?: TypographyColor;
  shortForm?: string;
  rightTextVariant?: TypographyProps['variant'];
  showCheckBox?: boolean;
  id?: string;
  onClick?: () => void;
  selectedItem?: string | undefined;
  changeColorWhite?: boolean;
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

export interface DropDownListItemHorizontalBoxProps {
  isChecked: boolean;
  borderRadius?: string; // Change the type to string or use a custom type alias
}

const ShortFormTag = styled.div`
  font-size: 13px;
  font-weight: 600;
  display: inline-block;
  color: ${theme.palette.text.muted};
  padding-left: 5px;
`;

export const DropDownListItemHorizontalBox = styled.div<
  DropDownListItemHorizontalBoxProps & BorderProps
>`
  display: flex;
  padding: 12px 24px;
  align-items: center;
  gap: 16px;
  align-self: stretch;
  border-bottom: 1px solid ${theme.palette.border.list};
  background-color: ${theme.palette.background.dropdown};
  &:hover {
    background-color: ${theme.palette.background.dropdownHover};
  }
  ${border}
`;

export const DropDownListItemIconContainer = styled.div`
  display: flex;
  align-items: center;
`;

export const DropDownListItemStretchedTypography = styled(Typography)<{
  shouldStretch: boolean;
  changeColor?: boolean;
}>`
  /* flex: ${({ shouldStretch }) => (shouldStretch ? '1' : 'unset')}; */
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
  selectedItem = undefined,
  text,
  shortForm = '',
  tag,
  rightTextVariant = 'fineprint',
  rightTextColor = 'gold',
  showCheckBox = false,
  checked = false,
  id,
  onClick,
  restrictedItem = false,
  changeColorWhite = false,
  onCheckedChange,
  $borderRadius,
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

  const handleBoxClick = () => {
    if (showCheckBox) handleCheckBoxChange();
    if (onClick) onClick();
  };

  return (
    <DropDownListItemHorizontalBox
      onClick={handleBoxClick}
      isChecked={checked}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      $borderRadius={$borderRadius}
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
        variant="h6"
        changeColor={changeColorWhite || isHovered}
      >
        <LangDisplay text={text} />
        <ShortFormTag>
          <LangDisplay text={shortForm} />
        </ShortFormTag>
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
  shortForm: '',
};
