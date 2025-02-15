import React, { FC, ReactNode } from 'react';
import { XTableCell } from './TableCell';
import { PaymentReceivedIcon, PaymentSentIcon } from '../../icons';
import { ThemeType } from '../../themes';
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
  const statusToColorKey: Record<
    TransactionStatus,
    keyof ThemeType['palette']
  > = {
    success: 'white',
    pending: 'warning',
    failed: 'error',
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
      primaryTextColor={statusToColorKey[transactionStatus]}
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
