import React, { FC, ReactElement } from 'react';
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

export interface LeanBoxProps {
  leftImageSrc?: string;
  rightImageSrc?: string;
  rightText?: string;
  tag?: string;
  text: string;
  shortForm?: string;
  displayRadioButton?: boolean;
  radioButtonValue?: string;
  rightTextColor?: TypographyColor;
  textVariant?: TypographyProps['variant'];
  rightTextVariant?: TypographyProps['variant'];
  color?: TypographyColor;
  checkBox?: boolean;
  onCheckBoxChange?: (isChecked: boolean) => void;
  id?: string;
  forceUncheck?: boolean;
  selectedItem?: LeanBoxProps | null;
  animate?: boolean;
}

export interface HorizontalBoxProps {
  isChecked: boolean;
}

export const HorizontalBox = styled.div<HorizontalBoxProps>`
  display: flex;
  padding: 8px 16px;
  align-items: center;
  gap: 16px;
  align-self: stretch;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.palette.border.input};
  background: ${({ isChecked, theme }) =>
    isChecked ? theme.palette.border.list : theme.palette.background.input};
  width: 422px;
  height: 42px;
`;

export const ImageContainer = styled.div`
  display: flex;
  align-items: center;
`;

export const StretchedTypography = styled(Typography)<{
  shouldStretch: boolean;
}>`
  flex: ${({ shouldStretch }) => (shouldStretch ? '1' : 'unset')};
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
  displayRadioButton,
  radioButtonValue,
  rightText,
  selectedItem,
  shortForm = '',
  text,
  tag,
  textVariant = 'fineprint',
  rightTextVariant = 'fineprint',
  color = 'muted',
  rightTextColor = 'gold',
  checkBox = false,
  onCheckBoxChange,
  forceUncheck = false,
  id,
  animate = false,
}): ReactElement => {
  const [isChecked, setIsChecked] = React.useState(false);

  React.useEffect(() => {
    if (forceUncheck) {
      setIsChecked(false);
    }
  }, [forceUncheck]);

  const handleCheckBoxChange = () => {
    setIsChecked(!isChecked);

    if (onCheckBoxChange) {
      onCheckBoxChange(!isChecked);
    }
  };

  const handleBoxClick = () => {
    if (checkBox) handleCheckBoxChange();
  };

  const handleRadioButtonChange = () => {
    // state code to be added here
  };

  return (
    <HorizontalBox isChecked={isChecked} onClick={handleBoxClick}>
      {displayRadioButton && (
        <RadioButton
          checked={selectedItem?.id === id}
          value={radioButtonValue}
          onChange={handleRadioButtonChange}
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
        shouldStretch={!tag}
        variant={textVariant}
        color={color}
      >
        {text}
      </StretchedTypography>
      <Typography $fontSize={13} $fontWeight="medium" color="muted">
        <LangDisplay text={shortForm} />
      </Typography>
      {tag && <Tag>{tag}</Tag>}
      <RightContent>
        {rightText && (
          <Typography variant={rightTextVariant} color={rightTextColor}>
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
        {checkBox && (
          <CheckBox
            checked={isChecked}
            onChange={handleCheckBoxChange}
            id={id ?? 'default-id'}
          />
        )}
      </RightContent>
    </HorizontalBox>
  );
};

LeanBox.defaultProps = {
  leftImageSrc: undefined,
  rightImageSrc: undefined,
  rightText: undefined,
  rightTextColor: 'muted',
  textVariant: 'fineprint',
  displayRadioButton: false,
  radioButtonValue: '',
  rightTextVariant: 'fineprint',
  color: 'muted',
  checkBox: false,
  id: undefined,
  forceUncheck: false,
  tag: undefined,
  onCheckBoxChange: undefined,
  selectedItem: undefined,
  animate: false,
  shortForm: '',
};
