import React, { FC, ReactElement, useCallback, useRef, useState } from 'react';
import styled from 'styled-components';

import {
  CheckBox,
  LangDisplay,
  RadioButton,
  InputLabel,
  Tag,
  Typography,
  TypographyColor,
  TypographyProps,
} from '../atoms';
import { UtilsProps, spacing } from '../utils';

export interface LeanBoxProps extends UtilsProps {
  leftImage?: React.ReactNode;
  rightImage?: React.ReactNode;
  rightText?: string;
  tag?: string;
  text: string;
  shortForm?: string;
  rightTextColor?: TypographyColor;
  textVariant?: TypographyProps['variant'];
  rightTextVariant?: TypographyProps['variant'];
  color?: TypographyColor;
  checkType?: 'checkbox' | 'radio';
  id?: string;
  $isChecked?: boolean;
  onCheckChanged?: ($isChecked: boolean) => void;
  disabled?: boolean;
  value?: string;
  [key: string]: any;
}

export const HorizontalBox = styled.div<{
  $isChecked: boolean;
  $checkType?: string;
}>`
  display: flex;
  padding: 8px 16px;
  align-items: center;
  gap: 16px;
  align-self: stretch;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.palette.border.input};
  background: ${({ $isChecked, theme }) =>
    $isChecked
      ? theme.palette.background.list
      : theme.palette.background.input};
  ${spacing};
  width: 100%;
  ${({ $checkType }) => $checkType && 'cursor: pointer'};
`;

export const ImageContainer = styled.div<{ gap?: number }>`
  display: flex;
  align-items: center;
  gap: ${props => (props.gap ? `${props.gap}px` : '0')};
`;

export const StretchedTypography = styled(Typography)<{
  $shouldStretch: boolean;
}>`
  flex: ${({ $shouldStretch }) => ($shouldStretch ? '1' : 'unset')};
`;

export const RightContent = styled.div`
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 16px;
`;

export const LeanBox: FC<LeanBoxProps> = ({
  leftImage,
  rightImage,
  rightText,
  shortForm = '',
  text,
  tag,
  textVariant = 'fineprint',
  rightTextVariant = 'fineprint',
  color = 'muted',
  rightTextColor = 'gold',
  checkType = undefined,
  id,
  $isChecked = false,
  onCheckChanged,
  value,
  disabled,
}): ReactElement => {
  const checkboxRef = useRef<HTMLInputElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const handleCheckChange = useCallback(() => {
    if (onCheckChanged) {
      onCheckChanged(!$isChecked);
    }
  }, [onCheckChanged, $isChecked]);

  const handleHover = useCallback(() => {
    setIsHovered(true);
    if (
      checkboxRef.current &&
      (checkType === 'checkbox' || checkType === 'radio')
    ) {
      checkboxRef.current.focus();
    }
  }, [checkType]);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    if (checkboxRef.current) {
      checkboxRef.current.blur();
    }
  }, []);

  return (
    <InputLabel
      px={0}
      py={0}
      onMouseEnter={handleHover}
      onMouseLeave={handleMouseLeave}
    >
      <HorizontalBox $isChecked={$isChecked} $checkType={checkType}>
        {checkType === 'radio' && (
          <RadioButton
            checked={$isChecked}
            value={value}
            onChange={handleCheckChange}
          />
        )}
        {leftImage && <ImageContainer>{leftImage}</ImageContainer>}
        <StretchedTypography
          $shouldStretch={!tag}
          variant={textVariant}
          color={color}
        >
          {text}
        </StretchedTypography>
        {shortForm && (
          <Typography $fontSize={13} $fontWeight="medium" color="muted">
            <LangDisplay text={shortForm} />
          </Typography>
        )}
        {tag && <Tag>{tag}</Tag>}
        <RightContent>
          {rightText && (
            <Typography
              variant={rightTextVariant}
              color={rightTextColor}
              $fontSize={14}
              $fontWeight="normal"
            >
              {rightText}
            </Typography>
          )}
          {rightImage && <ImageContainer>{rightImage}</ImageContainer>}
          {checkType === 'checkbox' && (
            <CheckBox
              checked={$isChecked}
              onChange={handleCheckChange}
              id={id ?? 'default-id'}
              $isHovered={isHovered}
              ref={checkboxRef}
              isDisabled={disabled}
            />
          )}
        </RightContent>
      </HorizontalBox>
    </InputLabel>
  );
};

LeanBox.defaultProps = {
  leftImage: undefined,
  rightImage: undefined,
  rightText: undefined,
  rightTextColor: 'muted',
  textVariant: 'fineprint',
  rightTextVariant: 'fineprint',
  color: 'muted',
  checkType: undefined,
  id: undefined,
  $isChecked: false,
  onCheckChanged: undefined,
  value: '',
  tag: '',
  shortForm: '',
  disabled: undefined,
};
