import React, { FC, ReactElement } from 'react';
import styled from 'styled-components';
import { Image, Typography, TypographyColor } from '../atoms';

interface LeanBoxProps {
  leftImageSrc: string;
  rightImageSrc?: string;
  rightText?: string;
  text: string;
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
  variant?: 'default' | 'custom' | 'fineprint';
  color?: TypographyColor;
}

const HorizontalBox = styled.div`
  display: flex;
  padding: 8px 16px;
  align-items: center;
  gap: 16px;
  align-self: stretch;
  border-radius: 8px;
  border: 1px solid #3c3937;
  background: var(--input-background, #27221d);
  width: 422px;
  height: 42px;
`;

const ImageContainer = styled.div`
  display: flex;
  align-items: center;
`;

const LeftImage = styled(Image)`
  /* Add any additional styles for the left image here */
`;

const RightImage = styled(Image)`
  /* Add any additional styles for the right image here */
`;

const RightText = styled(Typography)`
  /* Add any additional styles for the right text here */
`;

const StretchedTypography = styled(Typography)`
  flex: 1;
`;

export const LeanBox: FC<LeanBoxProps> = ({
  leftImageSrc,
  rightImageSrc,
  rightText,
  text,
  textVariant = 'fineprint',
  rightTextVariant = 'fineprint',
  variant = 'default',
  color = 'muted', // Set default color value
  rightTextColor = 'gold', // Set default color value for rightText
}): ReactElement => {
  const isCustomVariant = variant === 'custom';

  return (
    <HorizontalBox>
      <ImageContainer>
        <LeftImage
          src={leftImageSrc}
          alt="Left Image"
          width="20px"
          height="16px"
        />
      </ImageContainer>
      <StretchedTypography variant={textVariant} color={color}>
        {text}
      </StretchedTypography>
      {isCustomVariant && rightText && (
        <RightText variant={rightTextVariant} color={rightTextColor}>
          {rightText}
        </RightText>
      )}
      {!isCustomVariant && rightImageSrc && (
        <ImageContainer>
          <RightImage
            src={rightImageSrc}
            alt="Right Image"
            width="15px"
            height="12px"
          />
        </ImageContainer>
      )}
    </HorizontalBox>
  );
};

// Add defaultProps declarations here
LeanBox.defaultProps = {
  rightImageSrc: undefined,
  rightText: undefined,
  rightTextColor: 'muted',
  textVariant: 'fineprint',
  rightTextVariant: 'fineprint',
  variant: 'default',
  color: 'muted',
};
