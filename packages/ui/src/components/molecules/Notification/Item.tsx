import React from 'react';
import styled from 'styled-components';

import { SvgProps } from '../../../assets';
import { useTheme } from '../../../themes';
import { Typography, Container } from '../../atoms';
import { UtilsProps, utils } from '../../utils';
import { getTransactionFillFromStatus, TransactionTableStatus } from '../Table';

const NotificationItemWrapperStyle = styled.div<UtilsProps>`
  padding: 0 40px;
  width: 100%;
  ${utils}
`;

export interface NotificationItemProps extends UtilsProps {
  icon: React.FC<SvgProps>;
  status: TransactionTableStatus;
  title: string;
  description: React.ReactNode;
  time: string;
}

export const NotificationItem: React.FC<NotificationItemProps> = ({
  icon: IconComponent,
  status,
  title,
  description,
  time,
  ...utilProps
}) => {
  const theme = useTheme();

  return (
    <NotificationItemWrapperStyle {...utilProps}>
      <Container direction="row" justify="flex-start">
        <IconComponent fill={getTransactionFillFromStatus(status, theme)} />
        <Container
          ml={3}
          direction="column"
          align="flex-start"
          justify="flex-start"
        >
          <Typography
            $fontSize={16}
            color={getTransactionFillFromStatus(status, theme) as any}
          >
            {title}
          </Typography>
          {description}
          <Typography $fontSize={14} color="muted">
            {time}
          </Typography>
        </Container>
      </Container>
    </NotificationItemWrapperStyle>
  );
};
