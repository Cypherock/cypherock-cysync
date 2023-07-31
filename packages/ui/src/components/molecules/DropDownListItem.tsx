import React, { FC, ReactElement } from 'react';
import styled, { css } from 'styled-components';

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
import { BorderProps, SpacingProps, border, spacing } from '../utils';

export interface DropDownListItemProps extends BorderProps {
  leftImageSrc?: string;
  rightIconSrc?: string;
  rightText?: string;
  $hasRightText?: boolean;
  tag?: string;
  text: string;
  radioButtonValue?: string;
  $restrictedItem?: boolean;
  rightTextColor?: TypographyColor;
  shortForm?: string;
  rightTextVariant?: TypographyProps['variant'];
  checkType?: 'checkbox' | 'radio';
  id?: string;
  onClick?: () => void;
  checked?: boolean;
  onCheckedChange?: (id: string) => void;
  color?: TypographyColor;
  parentId?: string;
  // subMenu?: DropDownListItemProps[];
  $isFocused?: boolean;
}

export interface DropDownListItemHorizontalBoxProps {
  $isChecked: boolean;
}

const ShortFormTag = styled.div`
  font-size: 13px;
  font-weight: 600;
  display: inline-block;
  color: ${({ theme }) => theme.palette.text.muted};
  padding-left: 5px;
`;

export const DropDownListItemStretchedTypography = styled(Typography)<
  DropDownListItemHorizontalBoxProps & {
    $shouldStretch: boolean;
    $color: TypographyColor;
  }
>`
  color: ${({ $isChecked, $color, theme }) =>
    $isChecked ? theme.palette.text.white : theme.palette.text[$color]};
`;

export const DropDownListItemHorizontalBox = styled.div<
  DropDownListItemHorizontalBoxProps &
    DropDownListItemProps &
    BorderProps &
    SpacingProps & { $hasRightText?: boolean }
>`
  display: flex;
  padding-top: 12px;
  padding-right: ${({ $hasRightText }) => ($hasRightText ? '48px' : '24px')};
  padding-bottom: 12px;
  padding-left: 24px;
  align-items: center;
  gap: 16px;
  align-self: stretch;
  border-bottom: 1px solid ${({ theme }) => theme.palette.border.list};
  background-color: ${({ $restrictedItem, $isChecked, theme, $isFocused }) => {
    if ($isFocused) {
      return theme.palette.background.dropdownHover;
    }
    if ($restrictedItem) {
      return theme.palette.background.separatorSecondary;
    }
    if ($isChecked) {
      return theme.palette.background.dropdownHover;
    }
    return theme.palette.background.separatorSecondary;
  }};
  &:hover {
    background-color: ${({ theme }) => theme.palette.background.dropdownHover};
    ${DropDownListItemStretchedTypography} {
      color: ${({ theme }) => theme.palette.text.white};
    }
  }
  color: ${({ theme }) => theme.palette.text.muted};
  ${({ parentId, $restrictedItem }) =>
    parentId &&
    !$restrictedItem &&
    css`
      border-left: 0.5px solid
        ${({ theme }) => theme.palette.border.subMenuLeft} !important;
      margin-left: 30px;
    `}
  ${border}
  ${spacing}
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

const DropDownItemWrapper = styled.div<{ $isFocused: boolean }>`
  display: flex;
  flex-direction: column;
  background-color: ${({ $isFocused, theme }) =>
    $isFocused
      ? theme.palette.background.dropdownHover
      : theme.palette.background.separatorSecondary};
  border-radius: 8px;
`;

const RightTextTypography = styled(Typography)<{ $hasRightText?: boolean }>`
  font-size: ${({ $hasRightText }) => ($hasRightText ? '14px' : '13px')};
  font-weight: 400;
`;

export const DropDownListItem: FC<DropDownListItemProps> = ({
  leftImageSrc,
  rightIconSrc,
  radioButtonValue,
  rightText,
  parentId = '',
  text,
  shortForm = '',
  tag,
  rightTextVariant = 'fineprint',
  rightTextColor = 'gold',
  checkType = undefined,
  checked = false,
  $hasRightText = false,
  id,
  color,
  onClick,
  $restrictedItem = false,
  onCheckedChange,
  $borderRadius,
  // subMenu = [],
  $isFocused = false,
}): ReactElement => {
  const handleCheckChange = () => {
    onCheckedChange?.(id ?? 'default-id');
  };

  const handleBoxClick = () => {
    if (checkType) handleCheckChange();
    if (onClick) onClick();
  };

  return (
    <DropDownItemWrapper $isFocused={$isFocused}>
      <DropDownListItemHorizontalBox
        onClick={handleBoxClick}
        $isChecked={checked}
        $borderRadius={$borderRadius}
        $hasRightText={$hasRightText}
        $restrictedItem={$restrictedItem}
        text={text}
        $isFocused={$isFocused}
        parentId={parentId}
      >
        {!$restrictedItem && checkType && checkType === 'radio' && (
          <RadioButton
            checked={checked}
            value={radioButtonValue}
            onChange={handleCheckChange}
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
          $shouldStretch={!tag}
          variant="h6"
          $color={color ?? 'muted'}
          $isChecked={checked}
        >
          <LangDisplay text={text} />
          <ShortFormTag>
            <LangDisplay text={shortForm} />
          </ShortFormTag>
        </DropDownListItemStretchedTypography>
        {tag && <Tag>{tag}</Tag>}
        <DropDownListItemRightContent>
          {rightText && (
            <RightTextTypography
              variant={rightTextVariant}
              color={rightTextColor}
              $hasRightText={$hasRightText}
            >
              {rightText}
            </RightTextTypography>
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
          {!$restrictedItem && checkType && checkType === 'checkbox' && (
            <CheckBox
              checked={checked}
              onChange={handleCheckChange}
              id={id ?? 'default-id'}
            />
          )}
        </DropDownListItemRightContent>
      </DropDownListItemHorizontalBox>
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
  $restrictedItem: false,
  checked: false,
  onCheckedChange: undefined,
  shortForm: '',
  color: 'muted',
  $hasRightText: false,
  $isFocused: false,
  parentId: '',
};
