import React, { FC, ReactElement, useMemo, useRef } from 'react';
import Marquee from 'react-fast-marquee';
import styled, { css } from 'styled-components';

import {
  CheckBox,
  Flex,
  LangDisplay,
  RadioButton,
  Tag,
  TagType,
  Typography,
  TypographyColor,
  TypographyProps,
} from '../atoms';
import { BorderProps, SpacingProps, border, spacing } from '../utils';

export interface DropDownItemProps extends BorderProps {
  leftImage?: React.ReactNode;
  rightIcon?: React.ReactNode;
  rightText?: string;
  $hasRightText?: boolean;
  tag?: string;
  tagType?: TagType;
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
  disabled?: boolean;
  isShowCase?: boolean;
}

export interface DropDownListItemHorizontalBoxProps {
  $isChecked: boolean;
  disabled: boolean;
}

const ShortFormTag = styled.div<{ disabled: boolean }>`
  font-size: 13px;
  font-weight: 600;
  display: inline-block;
  color: ${({ theme, disabled }) =>
    disabled ? theme.palette.text.disabled : theme.palette.text.muted};
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

  color: ${({ $isChecked, $color, theme, disabled }) => {
    if (disabled) return theme.palette.text.disabled;
    return $isChecked ? theme.palette.text.white : theme.palette.text[$color];
  }};
`;

const RightTextTypography = styled(Typography)<{
  $hasRightText?: boolean;
  disabled?: boolean;
  color: TypographyColor;
}>`
  font-size: ${({ $hasRightText }) => ($hasRightText ? '14px' : '13px')};
  font-weight: 400;
  white-space: nowrap;
  color: ${({ theme, color, disabled }) =>
    disabled ? theme.palette.text.disabled : color};
`;

export const DropDownListItemHorizontalBox = styled.div<
  DropDownListItemHorizontalBoxProps &
    DropDownItemProps &
    BorderProps &
    SpacingProps & {
      $hasRightText?: boolean;
    }
>`
  pointer-events: ${({ disabled }) => (disabled ? 'none' : 'auto')};
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
      color: ${({ theme, disabled }) =>
        disabled ? theme.palette.text.disabled : theme.palette.text.white};
    }
    ${RightTextTypography} {
      color: ${({ theme, disabled }) =>
        disabled ? theme.palette.text.disabled : theme.palette.text.white};
    }
  }
  color: ${({ theme, disabled }) =>
    disabled ? theme.palette.text.disabled : theme.palette.text.muted};
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

export const DropDownListItemIconContainer = styled.div<{ disabled: boolean }>`
  display: flex;
  align-items: center;
  ${({ disabled }) =>
    disabled ? 'filter: grayscale(100%) brightness(0.50);' : ''}
`;

export const DropDownListItemRightContent = styled.div`
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 16px;
`;

export const SmartMarquee: FC<{
  children: React.ReactNode | React.ReactNode[];
  isOverflow: boolean;
}> = ({ children, isOverflow }) => {
  if (!isOverflow) {
    // eslint-disable-next-line react/jsx-no-useless-fragment
    return <>{children}</>;
  }

  return <Marquee direction="left">{children}</Marquee>;
};

export const DropDownItem: FC<DropDownItemProps> = ({
  leftImage,
  rightIcon,
  radioButtonValue,
  rightText,
  $parentId = '',
  text,
  shortForm = '',
  tag,
  tagType,
  rightTextVariant = 'fineprint',
  rightTextColor = 'muted',
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
  disabled = false,
  isShowCase = false,
}): ReactElement => {
  const handleCheckChange = () => {
    if (disabled) return;
    onCheckedChange?.(id ?? 'default-id');
  };

  const handleBoxClick = () => {
    if (disabled) return;
    handleCheckChange();
    if (onClick) onClick();
  };

  const parentRef = useRef<HTMLDivElement | null>(null);
  const childRef = useRef<HTMLDivElement | null>(null);

  const isOverflow = useMemo<boolean>(() => {
    if (parentRef.current === null) return false;
    if (childRef.current === null) return false;
    return parentRef.current.offsetWidth < childRef.current.offsetWidth;
  }, [parentRef.current, childRef.current]);

  return (
    <DropDownListItemHorizontalBox
      id={id}
      onClick={handleBoxClick}
      $isChecked={checked}
      $borderRadius={$borderRadius}
      $hasRightText={$hasRightText}
      $restrictedItem={$restrictedItem}
      text={text}
      $isFocused={$isFocused}
      $parentId={$parentId}
      disabled={disabled}
    >
      {!$restrictedItem && checkType === 'radio' && (
        <RadioButton
          checked={checked}
          value={radioButtonValue}
          onChange={handleCheckChange}
          disabled={disabled}
        />
      )}
      {!$restrictedItem && checkType === 'checkbox' && (
        <CheckBox
          checked={checked}
          onChange={handleCheckChange}
          id={id ?? 'default-id'}
          flexProps={{ $alignSelf: 'center' }}
          isDisabled={disabled}
        />
      )}
      {leftImage && (
        <DropDownListItemIconContainer disabled={disabled}>
          {leftImage}
        </DropDownListItemIconContainer>
      )}
      <Flex direction="column" $overflowX="hidden" width="full" ref={parentRef}>
        <SmartMarquee isOverflow={isShowCase ? false : isOverflow}>
          <Flex
            align="center"
            gap={16}
            pr={1}
            ref={childRef}
            $width={isShowCase ? undefined : 'max-content'}
          >
            <DropDownListItemStretchedTypography
              variant="h6"
              $color={disabled ? 'disabled' : color ?? 'muted'}
              $isChecked={checked}
              $restrictedItem={$restrictedItem}
              $textMaxWidth={$textMaxWidth}
              $textMaxWidthWhenSelected={$textMaxWidthWhenSelected}
              disabled={disabled}
            >
              <LangDisplay text={text} $noPreWrap />
              {shortForm && (
                <ShortFormTag disabled={disabled}>
                  <LangDisplay text={shortForm} />
                </ShortFormTag>
              )}
            </DropDownListItemStretchedTypography>
            {tag && <Tag type={tagType}>{tag}</Tag>}
          </Flex>
        </SmartMarquee>
        {showRightTextOnBottom && rightText && (
          <RightTextTypography
            variant={rightTextVariant}
            color={rightTextColor}
            $hasRightText={$hasRightText}
            disabled={disabled}
          >
            {rightText}
          </RightTextTypography>
        )}
      </Flex>
      {(rightText || rightIcon) && (
        <DropDownListItemRightContent>
          {!showRightTextOnBottom && rightText && (
            <RightTextTypography
              variant={rightTextVariant}
              color={rightTextColor}
              $hasRightText={$hasRightText}
              disabled={disabled}
            >
              {rightText}
            </RightTextTypography>
          )}
          {rightIcon && (
            <DropDownListItemIconContainer disabled={disabled}>
              {rightIcon}
            </DropDownListItemIconContainer>
          )}
        </DropDownListItemRightContent>
      )}
    </DropDownListItemHorizontalBox>
  );
};

DropDownItem.defaultProps = {
  rightIcon: undefined,
  leftImage: undefined,
  rightText: undefined,
  rightTextColor: 'muted',
  radioButtonValue: '',
  rightTextVariant: 'fineprint',
  checkType: undefined,
  id: undefined,
  tag: undefined,
  tagType: 'tag',
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
  disabled: false,
  isShowCase: false,
};
