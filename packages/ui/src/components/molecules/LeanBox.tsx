import React, { FC, ReactElement, useCallback, useRef, useState } from 'react';
import styled from 'styled-components';

import {
  CheckBox,
  Image,
  LangDisplay,
  RadioButton,
  InputLabel,
  Tag,
  Typography,
  TypographyColor,
  TypographyProps,
} from '../atoms';
import { SpacingProps, spacing } from '../utils';

export interface LeanBoxProps extends SpacingProps {
  leftImageSrc?: string;
  rightImageSrc?: string;
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
  animate?: boolean;
  $isChecked?: boolean;
  onCheckChanged?: ($isChecked: boolean) => void;
  value?: string;
}

export const HorizontalBox = styled.div<{
  $isChecked: boolean;
  $isCheckable: boolean;
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
  height: 42px;
  cursor: ${({ $isCheckable }) => ($isCheckable ? 'pointer' : 'default')};
`;

export const ImageContainer = styled.div`
  display: flex;
  align-items: center;
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
  leftImageSrc,
  rightImageSrc,
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
  animate = false,
  $isChecked = false,
  onCheckChanged,
  value,
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
      <HorizontalBox
        $isChecked={$isChecked}
        $isCheckable={checkType === 'radio' || checkType === 'checkbox'}
      >
        {checkType === 'radio' && (
          <RadioButton
            checked={$isChecked}
            value={value}
            onChange={handleCheckChange}
          />
        )}
        {leftImageSrc && (
          <ImageContainer>
            <Image
              src={leftImageSrc}
              alt="Left Image"
              width="20px"
              height="16px"
            />
          </ImageContainer>
        )}
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
          {rightImageSrc && (
            <ImageContainer>
              {animate ? (
                <Image
                  src={rightImageSrc}
                  alt="Right Image"
                  width="15px"
                  height="12px"
                  animate="spin"
                />
              ) : (
                <Image
                  src={rightImageSrc}
                  alt="Right Image"
                  width="15px"
                  height="12px"
                />
              )}
            </ImageContainer>
          )}
          {checkType === 'checkbox' && (
            <CheckBox
              checked={$isChecked}
              onChange={handleCheckChange}
              id={id ?? 'default-id'}
              $isHovered={isHovered}
              ref={checkboxRef}
            />
          )}
        </RightContent>
      </HorizontalBox>
    </InputLabel>
  );
};

LeanBox.defaultProps = {
  leftImageSrc: undefined,
  rightImageSrc: undefined,
  rightText: undefined,
  rightTextColor: 'muted',
  textVariant: 'fineprint',
  rightTextVariant: 'fineprint',
  color: 'muted',
  checkType: undefined,
  id: undefined,
  animate: false,
  $isChecked: false,
  onCheckChanged: undefined,
  value: '',
  tag: '',
  shortForm: '',
};
