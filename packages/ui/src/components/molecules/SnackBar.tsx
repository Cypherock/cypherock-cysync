import React from 'react';
import styled from 'styled-components';

import { StretchedTypography } from './LeanBox';

import { Button, Image } from '../atoms';

const SnackBarWrapper = styled.div`
  position: fixed;
  bottom: 45px;
  left: 60%;
  transform: translateX(-50%);
  width: 680px;
  max-width: calc(40% + 40px);
  height: 40px;
  background-color: ${({ theme }) => theme.palette.background.input};
  display: flex;
  flex-direction: row;
  gap: 16px;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.palette.border.input};
  z-index: 100;
`;

const SnackBarPadding = styled.div`
  padding: 8px 16px;
  display: flex;
  flex-direction: row;
  gap: 16px;
  flex: 1;
`;

const SnackBarButton = styled(Button)`
  margin: 4px 16px;
`;

interface SnackBarProps {
  text: string;
  imageSrc: string;
  imageAlt: string;
  buttonName: string;
}

export const SnackBar: React.FC<SnackBarProps> = ({
  text,
  imageSrc,
  imageAlt,
  buttonName,
}) => (
  <SnackBarWrapper>
    <SnackBarPadding>
      <Image src={imageSrc} alt={imageAlt} />
      <StretchedTypography variant="h6" $shouldStretch>
        {text}
      </StretchedTypography>
    </SnackBarPadding>
    <SnackBarButton variant="primary" size="sm">
      {buttonName}
    </SnackBarButton>
  </SnackBarWrapper>
);
