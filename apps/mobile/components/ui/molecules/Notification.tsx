import React, { ReactNode } from 'react';
import styled from 'styled-components/native';
import { ThemeType } from '../themes';
import { TouchableOpacityProps, View } from 'react-native';
import { Typography } from '../atoms';
import { PaymentReceivedIcon, PaymentSentIcon } from '../icons';
import { colors } from '../themes/color.styled';
import { TransactionType } from './Table';

type NotificationType = TransactionType;
type NotificationStatus = 'success' | 'failed' | 'pending';

export interface NotificationProps extends TouchableOpacityProps {
  type: NotificationType;
  status: NotificationStatus;
  icon: ReactNode;
  info: string;
  time: string;
  isClicked?: boolean;
}

const NotificationContainer = styled.TouchableOpacity<{ isClicked?: boolean }>`
  margin-top: 12px;
  flex-direction: row;
  gap: 16px;
  align-items: center;
  opacity: ${({ isClicked }) => (isClicked ? 0.5 : 1)};
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
  receive: status => <PaymentReceivedIcon fill={StatusToColorHex[status]} />,
  send: status => <PaymentSentIcon fill={StatusToColorHex[status]} />,
  hidden: () => null,
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
  ...props
}: NotificationProps) {
  const statusToTitle: Record<NotificationStatus, string> = {
    success: type === 'send' ? 'Sent' : 'Received',
    failed: type === 'send' ? 'Sent Failed' : 'Received Failed',
    pending: type === 'send' ? 'Sent Pending' : 'Received Pending',
  };

  return (
    <NotificationContainer {...props}>
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
          {icon} {info}
        </Typography>
      </View>
    </NotificationContainer>
  );
}
