import React from 'react';
import styled from 'styled-components';

import { Typography, LangDisplay } from '../../atoms';
import { UtilsProps, utils } from '../../utils';

const NotificationGroupHeaderWrapperStyle = styled.div<UtilsProps>`
  padding: 0 40px;
  width: 100%;
  ${utils}
`;

const NotificationGroupHeaderContainerStyle = styled.div`
  padding: 4px 16px;
  width: 100%;
  background: ${({ theme }) => theme.palette.background.content};
  border-radius: 8px;
`;

export interface NotificationGroupHeaderProps extends UtilsProps {
  text: string;
}

export const NotificationGroupHeader: React.FC<
  NotificationGroupHeaderProps
> = ({ text, ...utilProps }) => (
  <NotificationGroupHeaderWrapperStyle {...utilProps}>
    <NotificationGroupHeaderContainerStyle>
      <Typography color="muted" $fontSize={12} $fontWeight="semibold">
        <LangDisplay text={text} />
      </Typography>
    </NotificationGroupHeaderContainerStyle>
  </NotificationGroupHeaderWrapperStyle>
);
