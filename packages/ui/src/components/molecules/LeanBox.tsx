import React, { FC, ReactElement, useCallback } from 'react';
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
  Flex,
} from '../atoms';
import { UtilsProps } from '../utils';

export interface LeanBoxProps extends UtilsProps {
  leftImage?: React.ReactNode;
  rightImage?: React.ReactNode;
  rightText?: string;
  tag?: string;
  text: string;
  altText?: string;
  fontSize?: number;
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
  width: 422px;
  height: 42px;
  ${({ $checkType }) => $checkType && 'cursor: pointer'};
`;

export const ImageContainer = styled.div<{ gap?: number }>`
  display: flex;
  align-items: center;
  gap: ${props => (props.gap ? `${props.gap}px` : '0')};
`;

export const StretchedTypography = styled(Typography)<{
  $shouldStretch: boolean;
  fontSize?: number;
}>`
  flex: ${({ $shouldStretch }) => ($shouldStretch ? '1' : 'unset')};
  font-size: ${({ fontSize }) => (fontSize ? `${fontSize}px` : 'inherit')};
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
  altText,
  fontSize = 16,
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
  const handleCheckChange = useCallback(() => {
    if (onCheckChanged) {
      onCheckChanged(!$isChecked);
    }
  }, [onCheckChanged, $isChecked]);

  return (
    <InputLabel px={0}>
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
          fontSize={fontSize}
        >
          <Flex align="center" gap={5}>
            {text}
            {altText && (
              <Typography $fontSize={fontSize} variant="span">
                <LangDisplay text={altText} />
              </Typography>
            )}
          </Flex>
        </StretchedTypography>

        {shortForm && (
          <Typography $fontSize={13} $fontWeight="medium" color="muted">
            <LangDisplay text={shortForm} />
          </Typography>
        )}
        {tag && <Tag>{tag}</Tag>}
        <RightContent>
          {rightText && (
            <Typography variant={rightTextVariant} color={rightTextColor}>
              {rightText}
            </Typography>
          )}
          {rightImage && <ImageContainer>{rightImage}</ImageContainer>}
          {checkType === 'checkbox' && (
            <CheckBox
              checked={$isChecked}
              onChange={handleCheckChange}
              id={id ?? 'default-id'}
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
  altText: undefined,
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
  fontSize: 16,
  shortForm: '',
  disabled: undefined,
};
