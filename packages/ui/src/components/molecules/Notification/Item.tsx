import React from 'react';
import styled from 'styled-components';

import { SvgProps } from '../../../assets';
import { ThemeType, useTheme } from '../../../themes';
import { Typography, Container } from '../../atoms';
import { UtilsProps, utils } from '../../utils';
import { getTransactionFillFromStatus, TransactionTableStatus } from '../Table';

const NotificationItemWrapperStyle = styled.div<UtilsProps>`
  padding: 0 40px;
  width: 100%;
  cursor: pointer;

  ${utils}
`;

const getTransactionTextFillFromStatus = (
  status: TransactionTableStatus,
  theme: ThemeType,
) => {
  const map: Record<TransactionTableStatus, string> = {
    success: theme.palette.text.white,
    pending: theme.palette.text.warn,
    failed: theme.palette.text.error,
  };

  return map[status];
};

export interface NotificationItemProps extends UtilsProps {
  icon: React.FC<SvgProps>;
  status: TransactionTableStatus;
  title: string;
  description: React.ReactNode;
  time: string;
  color?: string;
  onClick: () => void;
}

export const NotificationItem: React.FC<NotificationItemProps> = ({
  icon: IconComponent,
  status,
  title,
  description,
  time,
  onClick,
  color,
  ...utilProps
}) => {
  const theme = useTheme();

  return (
    <NotificationItemWrapperStyle {...utilProps} onClick={onClick}>
      <Container direction="row" justify="flex-start">
        <IconComponent
          fill={color ?? getTransactionFillFromStatus(status, theme)}
          width={25}
          height={20}
          $minWidth={25}
          $minHeight={20}
        />
        <Container
          ml={3}
          direction="column"
          align="flex-start"
          justify="flex-start"
        >
          <Typography
            $fontSize={16}
            color={
              color ?? (getTransactionTextFillFromStatus(status, theme) as any)
            }
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

NotificationItem.defaultProps = {
  color: undefined,
};
