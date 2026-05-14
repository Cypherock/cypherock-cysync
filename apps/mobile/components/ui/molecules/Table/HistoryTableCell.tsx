import React, { FC, ReactNode } from 'react';
import { XTableCell } from './TableCell';
import { PaymentReceivedIcon, PaymentSentIcon } from '../../icons';
import { ThemeType, useTheme } from '../../themes';
import { colors } from '../../themes/color.styled';
import styled from 'styled-components/native';
import { View } from 'react-native';
import {
  TransactionTypeMap,
  TransactionStatus,
} from '@cypherock/db-interfaces';

export type TransactionType = keyof typeof TransactionTypeMap;

interface HistoryTableTimeCellProps {
  transactionType: TransactionType;
  transactionStatus: TransactionStatus;
  transactionTime: string;
  transactionTypeText: string;
}

interface HistoryTableAmountCellProps {
  icon: ReactNode;
  cryptoAmount: string;
  fiatAmount: string;
}

export const StatusToColorHex: Record<TransactionStatus, string> = {
  success: colors.success,
  pending: colors.warning,
  failed: colors.error,
  expired: colors.error,
  cancelled: colors.error,
  rejected: colors.error,
};

export const TransactionTypeToIcon: Record<
  TransactionType,
  (status: TransactionStatus) => ReactNode
> = {
  receive: status => <PaymentReceivedIcon fill={StatusToColorHex[status]} />,
  send: status => <PaymentSentIcon fill={StatusToColorHex[status]} />,
  hidden: () => null,
};

const LeftIconContainer = styled(View)`
  display: flex;
  width: 20px;
  height: 20px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;

  border-radius: 5px;
  background: ${({ theme }) => theme.palette.border.secondary};
`;

export const HistoryTableTimeCell: FC<HistoryTableTimeCellProps> = ({
  transactionType,
  transactionTypeText,
  transactionStatus,
  transactionTime,
}) => {
  const theme = useTheme();
  
  const statusToColorKey: Record<
    TransactionStatus,
    string
  > = {
    success: theme.palette.white,
    pending: theme.palette.warning,
    failed: theme.palette.error,
    expired: theme.palette.error,
    cancelled: theme.palette.error,
    rejected: theme.palette.error,
  };

  return (
    <XTableCell
      leftIcon={
        <LeftIconContainer>
          {TransactionTypeToIcon[transactionType](transactionStatus)}
        </LeftIconContainer>
      }
      primaryText={transactionTypeText}
      primaryTextType={'heading'}
      primaryTextColor={statusToColorKey[transactionStatus] as keyof ThemeType['palette']}
      secondaryText={transactionTime}
    />
  );
};

export const HistoryTableAmountCell: FC<HistoryTableAmountCellProps> = ({
  icon,
  cryptoAmount,
  fiatAmount,
}) => {
  return (
    <XTableCell
      primaryLeftIcon={icon}
      primaryText={cryptoAmount}
      primaryTextAlign="right"
      secondaryText={fiatAmount}
      secondaryTextAlign="right"
      justifyContent="flex-end"
    />
  );
};
