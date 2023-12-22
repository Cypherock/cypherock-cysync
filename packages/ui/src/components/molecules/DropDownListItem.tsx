import React, { FC, ReactElement } from 'react';
import styled, { css } from 'styled-components';

import {
  CheckBox,
  Flex,
  LangDisplay,
  RadioButton,
  Tag,
  Typography,
  TypographyColor,
  TypographyProps,
} from '../atoms';
import { BorderProps, SpacingProps, border, spacing } from '../utils';

export interface DropDownListItemProps extends BorderProps {
  leftImage?: React.ReactNode;
  rightIcon?: React.ReactNode;
  rightText?: string;
  $hasRightText?: boolean;
  tag?: string;
  text: string;
  $textMaxWidth?: string;
  $textMaxWidthWhenSelected?: string;
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
  $parentId?: string;
  $isFocused?: boolean;
  showRightTextOnBottom?: boolean;
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
    $color: TypographyColor;
    $restrictedItem?: boolean;
    $textMaxWidth?: string;
    $textMaxWidthWhenSelected?: string;
  }
>`
  text-overflow: ellipsis;
  white-space: nowrap;

  ${({ $restrictedItem, $textMaxWidthWhenSelected }) =>
    $restrictedItem &&
    $textMaxWidthWhenSelected &&
    `max-width: ${$textMaxWidthWhenSelected};`}
  ${({ $restrictedItem, $textMaxWidth }) =>
    !$restrictedItem && $textMaxWidth && `max-width: ${$textMaxWidth};`}

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
  min-height: 53px;
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
  ${({ $parentId, $restrictedItem }) =>
    $parentId &&
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

const RightTextTypography = styled(Typography)<{ $hasRightText?: boolean }>`
  font-size: ${({ $hasRightText }) => ($hasRightText ? '14px' : '13px')};
  font-weight: 400;
  white-space: nowrap;
`;

export const DropDownListItem: FC<DropDownListItemProps> = ({
  leftImage,
  rightIcon,
  radioButtonValue,
  rightText,
  $parentId = '',
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
  $isFocused = false,
  showRightTextOnBottom,
  $textMaxWidth,
  $textMaxWidthWhenSelected,
}): ReactElement => {
  const handleCheckChange = () => {
    onCheckedChange?.(id ?? 'default-id');
  };

  const handleBoxClick = () => {
    handleCheckChange();
    if (onClick) onClick();
  };

  return (
    <DropDownListItemHorizontalBox
      onClick={handleBoxClick}
      $isChecked={checked}
      $borderRadius={$borderRadius}
      $hasRightText={$hasRightText}
      $restrictedItem={$restrictedItem}
      text={text}
      $isFocused={$isFocused}
      $parentId={$parentId}
    >
      {!$restrictedItem && checkType && checkType === 'radio' && (
        <RadioButton
          checked={checked}
          value={radioButtonValue}
          onChange={handleCheckChange}
        />
      )}
      {leftImage && (
        <DropDownListItemIconContainer>
          {leftImage}
        </DropDownListItemIconContainer>
      )}
      <Flex direction="column" width="full">
        <Flex align="center" gap={16}>
          <DropDownListItemStretchedTypography
            variant="h6"
            $color={color ?? 'muted'}
            $isChecked={checked}
            $restrictedItem={$restrictedItem}
            $textMaxWidth={$textMaxWidth}
            $textMaxWidthWhenSelected={$textMaxWidthWhenSelected}
          >
            <LangDisplay text={text} $noPreWrap />
            {shortForm && (
              <ShortFormTag>
                <LangDisplay text={shortForm} />
              </ShortFormTag>
            )}
          </DropDownListItemStretchedTypography>
          {tag && <Tag>{tag}</Tag>}
        </Flex>
        {showRightTextOnBottom && rightText && (
          <RightTextTypography
            variant={rightTextVariant}
            color={rightTextColor}
            $hasRightText={$hasRightText}
          >
            {rightText}
          </RightTextTypography>
        )}
      </Flex>
      {(rightText ||
        rightIcon ||
        (!$restrictedItem && checkType && checkType === 'checkbox')) && (
        <DropDownListItemRightContent>
          {!showRightTextOnBottom && rightText && (
            <RightTextTypography
              variant={rightTextVariant}
              color={rightTextColor}
              $hasRightText={$hasRightText}
            >
              {rightText}
            </RightTextTypography>
          )}
          {rightIcon && (
            <DropDownListItemIconContainer>
              {rightIcon}
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
      )}
    </DropDownListItemHorizontalBox>
  );
};

DropDownListItem.defaultProps = {
  rightIcon: undefined,
  leftImage: undefined,
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
  $parentId: '',
  showRightTextOnBottom: undefined,
  $textMaxWidth: undefined,
  $textMaxWidthWhenSelected: undefined,
};
