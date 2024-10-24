import React from 'react';
import styled from 'styled-components';

import { StretchedTypography } from './LeanBox';

import { Check, InformationIcon } from '../../assets';
import { Button } from '../atoms';

const SnackBarWrapper = styled.div`
  position: fixed;
  bottom: 45px;
  left: 50%;
  transform: translateX(-50%);
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
  box-shadow: ${({ theme }) => theme.shadow.popup};
`;

const SnackBarPadding = styled.div`
  padding: 8px 16px;
  display: flex;
  align-items: center;
  flex-direction: row;
  gap: 16px;
  flex: 1;
`;

const SnackBarButton = styled(Button)`
  margin: 4px 16px;
`;

export type SnackBarIconsType = 'check' | 'info';

const snackBarIcons: Record<SnackBarIconsType, React.ReactNode> = {
  check: <Check width={16} height={16} />,
  info: <InformationIcon width={16} height={16} />,
};

export interface SnackBarProps {
  text: string;
  icon?: SnackBarIconsType;
  buttonText?: string;
  onButtonClick?: () => void;
}

export const SnackBar: React.FC<SnackBarProps> = ({
  text,
  icon = 'check',
  buttonText,
  onButtonClick,
}) => (
  <SnackBarWrapper>
    <SnackBarPadding>
      {snackBarIcons[icon]}
      <StretchedTypography variant="h6" $shouldStretch>
        {text}
      </StretchedTypography>
    </SnackBarPadding>
    {buttonText && (
      <SnackBarButton variant="primary" size="sm" onClick={onButtonClick}>
        {buttonText}
      </SnackBarButton>
    )}
  </SnackBarWrapper>
);

SnackBar.defaultProps = {
  icon: 'check',
  buttonText: undefined,
  onButtonClick: undefined,
};
