import React, { FC, ReactElement } from 'react';
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

export interface LeanBoxProps {
  leftImageSrc?: string;
  rightImageSrc?: string;
  rightText?: string;
  tag?: string;
  text: string;
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
  border: 1px solid #3c3937;
  background: ${({ isChecked }) =>
    isChecked ? '#2C2824' : 'var(--input-background, #27221d)'};
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

  const handleRadioButtonChange = () => {
    // state code to be added here
  };

  return (
    <HorizontalBox isChecked={isChecked}>
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
      {tag && <Tag>{tag}</Tag>}
      <RightContent>
        {rightText && (
          <Typography variant={rightTextVariant} color={rightTextColor}>
            {rightText}
          </Typography>
        )}
        {rightImageSrc && (
          <ImageContainer>
            <Image
              src={rightImageSrc}
              alt="Right Image"
              width="15px"
              height="12px"
            />
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
};
