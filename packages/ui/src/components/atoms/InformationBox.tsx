import React from 'react';
import styled from 'styled-components';

import { Image } from './Image';
import { Typography } from './Typography';

interface StyledInfoBoxProps {
  $backgroundColor?: string;
  $borderColor?: string;
}

interface InformationBoxProps extends StyledInfoBoxProps {
  imagePath: string;
  text: string;
  iconImagePath?: string;
}

const InfoBox = styled.div<StyledInfoBoxProps>`
  display: flex;
  flex-direction: row;
  gap: 16px;
  align-self: stretch;
  justify-content: flex-start;
  background-color: ${({ $backgroundColor, theme }) =>
    $backgroundColor && theme.palette.background[$backgroundColor]
      ? theme.palette.background[$backgroundColor]
      : theme.palette.background.input};
  border-radius: 8px;
  border: 1px solid
    ${({ $borderColor, theme }) =>
      $borderColor && theme.palette.border[$borderColor]
        ? theme.palette.border[$borderColor]
        : theme.palette.border.infoBox};
  margin-top: 40px;
`;

const InfoBoxPadding = styled.div`
  display: flex;
  flex-direction: row;
  gap: 16px;
  padding: 8px 16px;
`;

export const InformationBox: React.FC<InformationBoxProps> = ({
  imagePath,
  text,
  iconImagePath,
  $backgroundColor,
  $borderColor,
}) => (
  <InfoBox $backgroundColor={$backgroundColor} $borderColor={$borderColor}>
    <InfoBoxPadding>
      <Image src={imagePath} alt="Image" />
      <Typography
        variant="fineprint"
        color="muted"
        $fontSize={16}
        $fontWeight="light"
      >
        {text}
        {iconImagePath && <Image px={1} src={iconImagePath} alt="Icon Image" />}
      </Typography>
    </InfoBoxPadding>
  </InfoBox>
);

InformationBox.defaultProps = {
  iconImagePath: undefined,
  $backgroundColor: undefined,
  $borderColor: undefined,
};
