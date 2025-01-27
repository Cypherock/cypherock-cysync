import React, { ReactNode } from 'react';
import styled from 'styled-components/native';
import { ThemeType } from '../themes';
import { View } from 'react-native';
import { Typography } from '../atoms';
import { PaymentReceivedIcon, PaymentSentIcon } from '../icons';
import { colors } from '../themes/color.styled';

type NotificationType = 'sent' | 'received';
type NotificationStatus = 'success' | 'failed' | 'pending';

export interface NotificationProps {
  type: NotificationType;
  status: NotificationStatus;
  icon: ReactNode;
  info: string;
  time: string;
  amount: string;
}

const NotificationContainer = styled.View`
  margin-top: 12px;
  flex-direction: row;
  gap: 16px;
  align-items: center;
`;

const StatusToColorHex: Record<NotificationStatus, string> = {
  success: colors.success,
  pending: colors.warning,
  failed: colors.error,
};

const NotificationTypeToIcon: Record<
  NotificationType,
  (status: NotificationStatus) => ReactNode
> = {
  received: status => <PaymentReceivedIcon fill={StatusToColorHex[status]} />,
  sent: status => <PaymentSentIcon fill={StatusToColorHex[status]} />,
};

const StatusToColorKey: Record<NotificationStatus, keyof ThemeType['palette']> =
  {
    success: 'white',
    pending: 'warning',
    failed: 'error',
  };

const NotificationHeader = styled.View`
  flex-direction: row;
  justify-content: space-between;
`;

const NotificationTitle = styled.Text<{ status: NotificationStatus }>`
  color: ${({ theme, status }) => theme.palette[StatusToColorKey[status]]};
  font-size: ${({ theme }) => theme.typography.body.para.fontSize}px;
`;

const NotificationTime = styled.Text`
  color: ${({ theme }) => theme.palette.text.primary};
  font-size: ${({ theme }) => theme.typography.body.body.fontSize}px;
`;

export function NotificationItem({
  status,
  type,
  icon,
  info,
  time,
  amount,
}: NotificationProps) {
  const statusToTitle: Record<NotificationStatus, string> = {
    success: type === 'sent' ? 'Sent' : 'Received',
    failed: type === 'sent' ? 'Sent Failed' : 'Received Failed',
    pending: type === 'sent' ? 'Sent Pending' : 'Received Pending',
  };

  return (
    <NotificationContainer>
      {NotificationTypeToIcon[type](status)}
      <View style={{ flex: 1 }}>
        <NotificationHeader>
          <NotificationTitle status={status}>
            {statusToTitle[status]}
          </NotificationTitle>
          <NotificationTime>{time}</NotificationTime>
        </NotificationHeader>
        <Typography
          type="body"
          color="secondary"
          textAlign="left"
          style={{ flexShrink: 0 }}
        >
          {icon} <Typography type="body">{amount}</Typography> {info}
        </Typography>
      </View>
    </NotificationContainer>
  );
}
