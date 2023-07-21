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
import { BorderProps, border } from '../utils';

export interface DropDownListItemProps extends BorderProps {
  leftImageSrc?: string;
  rightIconSrc?: string;
  rightText?: string;
  tag?: string;
  text: string;
  subMenu?: DropDownListItemProps[];
  radioButtonValue?: string;
  restrictedItem?: boolean;
  rightTextColor?: TypographyColor;
  shortForm?: string;
  rightTextVariant?: TypographyProps['variant'];
  checkType?: 'checkbox' | 'radio';
  id?: string;
  onClick?: () => void;
  selectedItem?: string | undefined;
  changeColorWhite?: boolean;
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

export interface DropDownListItemHorizontalBoxProps {
  isChecked: boolean;
}

const DropDownItemWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const SubMenu = styled.ul`
  position: relative;
  padding-left: 56px;

  ::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    height: 100%; // adjust according to your need
    width: 1px;
    background-color: #000; // change the color as needed
  }
`;

const ShortFormTag = styled.div`
  font-size: 13px;
  font-weight: 600;
  display: inline-block;
  color: ${({ theme }) => theme.palette.text.muted};
  padding-left: 5px;
`;

export const DropDownListItemStretchedTypography = styled(Typography)<{
  shouldStretch: boolean;
  changeColor?: boolean;
}>`
  color: ${({ changeColor, theme }) =>
    changeColor ? theme.palette.text.white : theme.palette.text.muted};
`;

export const DropDownListItemHorizontalBox = styled.div<
  DropDownListItemHorizontalBoxProps & BorderProps
>`
  display: flex;
  padding: 12px 24px;
  align-items: center;
  gap: 16px;
  align-self: stretch;
  border-bottom: 1px solid ${({ theme }) => theme.palette.border.list};
  background-color: ${({ theme }) => theme.palette.background.dropdown};
  &:hover {
    background-color: ${({ theme }) => theme.palette.background.dropdownHover};
    ${DropDownListItemStretchedTypography} {
      color: ${({ theme }) => theme.palette.text.white};
    }
  }
  color: ${({ theme }) => theme.palette.text.muted};
  ${border}
`;

export const DropDownListItemIconContainer = styled.div`
  display: flex;
  align-items: center;
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
  radioButtonValue,
  rightText,
  selectedItem = undefined,
  text,
  shortForm = '',
  subMenu = [],
  tag,
  rightTextVariant = 'fineprint',
  rightTextColor = 'gold',
  checkType = undefined,
  checked = false,
  changeColorWhite = false,
  id,
  onClick,
  restrictedItem = false,
  onCheckedChange,
  $borderRadius,
}): ReactElement => {
  const [isChecked, setChecked] = useState(false);

  const handleCheckChange = () => {
    const newChecked = !isChecked;
    setChecked(newChecked);

    if (onCheckedChange) {
      onCheckedChange(newChecked);
    }
  };

  const handleBoxClick = () => {
    if (checkType) handleCheckChange();
    if (onClick) onClick();
  };

  return (
    <DropDownItemWrapper>
      <DropDownListItemHorizontalBox
        onClick={handleBoxClick}
        isChecked={checked}
        $borderRadius={$borderRadius}
      >
        {!restrictedItem && checkType && checkType === 'radio' && (
          <RadioButton checked={selectedItem === id} value={radioButtonValue} />
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
          changeColor={changeColorWhite}
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
          {!restrictedItem && checkType && checkType === 'checkbox' && (
            <CheckBox
              checked={checked}
              onChange={handleCheckChange}
              id={id ?? 'default-id'}
            />
          )}
        </DropDownListItemRightContent>
      </DropDownListItemHorizontalBox>
      {subMenu.length > 0 && (
        <div>
          <SubMenu>
            {subMenu.map(item => (
              <DropDownListItem key={item.id} {...item} />
            ))}
          </SubMenu>
        </div>
      )}
    </DropDownItemWrapper>
  );
};

DropDownListItem.defaultProps = {
  rightIconSrc: undefined,
  leftImageSrc: undefined,
  rightText: undefined,
  rightTextColor: 'muted',
  radioButtonValue: '',
  rightTextVariant: 'fineprint',
  checkType: undefined,
  id: undefined,
  tag: undefined,
  onClick: undefined,
  restrictedItem: false,
  selectedItem: undefined,
  changeColorWhite: false,
  checked: false,
  onCheckedChange: undefined,
  shortForm: '',
  subMenu: [],
};
