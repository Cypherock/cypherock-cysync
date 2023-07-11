import React, { FC, ReactElement } from 'react';
import styled from 'styled-components';

import {
  CheckBox,
  Image,
  RadioButton,
  Tag,
  Typography,
  TypographyColor,
} from '../atoms';

export interface TempListItemProps {
  leftImageSrc?: string;
  rightImageSrc?: string;
  rightText?: string;
  isHovered?: boolean;
  tag?: string;
  text: string;
  displayRadioButton?: boolean;
  radioButtonValue?: string;
  restrictedItem?: boolean;
  rightTextColor?: TypographyColor;
  textVariant?:
    | 'h1'
    | 'h2'
    | 'h3'
    | 'h4'
    | 'h5'
    | 'h6'
    | 'p'
    | 'span'
    | 'fineprint';
  rightTextVariant?:
    | 'h1'
    | 'h2'
    | 'h3'
    | 'h4'
    | 'h5'
    | 'h6'
    | 'p'
    | 'span'
    | 'fineprint';
  checkBox?: boolean;
  onCheckBoxChange?: (isChecked: boolean) => void;
  id?: string;
  forceUncheck?: boolean;
  onClick?: () => void;
  selectedItem?: TempListItemProps | null;
  shouldChangeColor?: boolean;
}

export interface HorizontalBox1Props {
  isChecked: boolean;
}

export const HorizontalBox1 = styled.div<HorizontalBox1Props>`
  display: flex;
  padding: 12px 24px;
  align-items: center;
  gap: 16px;
  align-self: stretch;
  border-bottom: 1px solid #2c2824;
`;

export const ImageContainer1 = styled.div`
  display: flex;
  align-items: center;
`;

export const StretchedTypography1 = styled(Typography)<{
  shouldStretch: boolean;
  changeColor?: boolean;
}>`
  flex: ${({ shouldStretch }) => (shouldStretch ? '1' : 'unset')};
  color: ${({ changeColor }) => (changeColor ? 'white' : '#8B8682')};
`;

export const RightContent1 = styled.div`
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 16px;
`;

export const TempListItem: FC<TempListItemProps> = ({
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
  //   color = 'muted', // Set default color value
  rightTextColor = 'gold', // Set default color value for rightText
  checkBox = false,
  onCheckBoxChange,
  isHovered = false,
  forceUncheck = false,
  id,
  onClick,
  restrictedItem = false,
  shouldChangeColor = false,
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

  return (
    <HorizontalBox1 onClick={onClick} isChecked={false}>
      {!restrictedItem && displayRadioButton && (
        <RadioButton
          checked={selectedItem?.id === id}
          value={radioButtonValue}
          onChange={value => console.log(`Radio button value: ${value}`)} // handle onChange as per your need
        />
      )}
      {leftImageSrc && (
        <ImageContainer1>
          <Image
            src={leftImageSrc}
            alt="Left Image"
            width="20px"
            height="16px"
          />
        </ImageContainer1>
      )}
      <StretchedTypography1
        shouldStretch={!tag}
        variant={textVariant}
        changeColor={shouldChangeColor || isHovered}
      >
        {text}
      </StretchedTypography1>
      {tag && <Tag>{tag}</Tag>}
      <RightContent1>
        {rightText && (
          <Typography variant={rightTextVariant} color={rightTextColor}>
            {rightText}
          </Typography>
        )}
        {rightImageSrc && (
          <ImageContainer1>
            <Image
              src={rightImageSrc}
              alt="Right Image"
              width="15px"
              height="12px"
            />
          </ImageContainer1>
        )}
        {!restrictedItem && checkBox && (
          <CheckBox
            checked={isChecked}
            onChange={handleCheckBoxChange}
            id={id ?? 'default-id'}
          />
        )}
      </RightContent1>
    </HorizontalBox1>
  );
};

// Add defaultProps declarations here
TempListItem.defaultProps = {
  rightImageSrc: undefined,
  leftImageSrc: undefined,
  isHovered: false,
  rightText: undefined,
  rightTextColor: 'muted',
  textVariant: 'fineprint',
  displayRadioButton: false,
  radioButtonValue: '',
  rightTextVariant: 'fineprint',
  checkBox: false,
  id: undefined,
  forceUncheck: false,
  tag: undefined,
  onCheckBoxChange: undefined,
  onClick: undefined,
  restrictedItem: false,
  selectedItem: undefined,
  shouldChangeColor: false,
};
