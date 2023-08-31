import React, { useMemo } from 'react';
import { styled } from 'styled-components';

import {
  TableHeader,
  TableHeaderComponent,
  TableHeaderComponentProps,
} from '../TableStyles';

export type TransactionTableHeaderName =
  | 'time'
  | 'asset'
  | 'account'
  | 'amount'
  | 'value';

export interface TransactionTableHeaderProps {
  time: string;
  asset: string;
  account: string;
  amount: string;
  value: string;
  onSort: (key: TransactionTableHeaderName) => void;
  selected: TransactionTableHeaderName;
  $ascending: boolean;
  isSmallScreen: boolean;
}

const TimeHeader = styled(TableHeader)`
  padding: 16px 16px 16px 88px;

  width: 42%;
  @media ${({ theme }) => theme.screens.lg} {
    width: 24%;
    padding: 16px 16px 16px 104px;
  }
`;

const AssetHeader = styled(TableHeader)`
  padding: 16px;

  width: 28%;
  @media ${({ theme }) => theme.screens.lg} {
    width: 16%;
  }
`;

const AccountHeader = styled(TableHeader)`
  padding: 16px;

  width: 30%;
`;

const AmountHeader = styled(TableHeader)`
  padding: 16px;

  width: 22%;
  @media ${({ theme }) => theme.screens.lg} {
    width: 15%;
  }
`;

const ValueHeader = styled(TableHeader)`
  padding: 16px;

  width: 15%;
`;

export const TransactionTableHeader: React.FC<TransactionTableHeaderProps> = ({
  time,
  asset,
  account,
  amount,
  value,
  onSort,
  $ascending,
  selected,
  isSmallScreen,
}) => {
  const headers: TableHeaderComponentProps['headers'] = useMemo(() => {
    const result = [
      {
        name: 'time',
        Wrapper: TimeHeader as any,
        isSortable: true,
        text: time,
      },
      {
        name: 'asset',
        Wrapper: AssetHeader as any,
        isSortable: true,
        text: asset,
      },
      {
        name: 'account',
        Wrapper: AccountHeader as any,
        isSortable: true,
        text: account,
      },
      {
        name: 'amount',
        Wrapper: AmountHeader as any,
        isSortable: true,
        text: amount,
      },
      {
        name: 'value',
        Wrapper: ValueHeader as any,
        isSortable: true,
        text: value,
      },
    ];

    if (isSmallScreen) {
      // Remove account and value headers
      result.splice(2, 1);
      result.splice(3, 1);
    }

    return result;
  }, [time, asset, account, amount, value, isSmallScreen]);

  return (
    <TableHeaderComponent
      headers={headers}
      onSort={onSort as any}
      selected={selected}
      $ascending={$ascending}
    />
  );
};
