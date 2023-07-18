import React from 'react';
import styled from 'styled-components';

import { Image } from './Image';
import { Typography } from './Typography';

const InfoBox = styled.div`
  display: flex;
  flex-direction: row;
  gap: 16px;
  align-self: stretch;
  justify-content: flex-start;
  background-color: #27221d;
  border-radius: 8px;
  border: 1px solid #3c3c3c;
  margin-top: 40px;
`;

const InfoBoxPadding = styled.div`
  display: flex;
  flex-direction: row;
  gap: 16px;
  padding: 8px 16px;
`;

interface InformationBoxProps {
  imagePath: string;
  text: string;
  iconImagePath?: string;
}

export const InformationBox: React.FC<InformationBoxProps> = ({
  imagePath,
  text,
  iconImagePath,
}) => (
  <InfoBox>
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
};

// export default InformationBox;
