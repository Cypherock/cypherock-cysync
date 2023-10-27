import React, { useMemo } from 'react';
import { styled } from 'styled-components';

import { TransactionTableVariant } from './types';

import {
  TableHeader,
  TableHeaderComponent,
  TableHeaderComponentProps,
} from '../TableStyles';

export type TransactionTableHeaderName =
  | 'time'
  | 'asset'
  | 'wallet'
  | 'account'
  | 'walletAndAccount'
  | 'amount'
  | 'value';

export interface TransactionTableHeaderProps {
  time: string;
  asset: string;
  wallet: string;
  account: string;
  walletAndAccount: string;
  amount: string;
  value: string;
  onSort: (key: TransactionTableHeaderName) => void;
  selected: TransactionTableHeaderName;
  $ascending: boolean;
  isSmallScreen: boolean;
  variant?: TransactionTableVariant;
}

const TimeHeader = styled(TableHeader)`
  padding: 16px 16px 16px 40px;

  width: 42%;
  @media ${({ theme }) => theme.screens.lg} {
    width: 24%;
    padding: 16px 16px 16px 40px;
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

const TimeHeaderForVariant = styled(TableHeader)`
  padding: 16px 16px 16px 40px;

  width: 42%;
`;

const AmountHeaderForVariant = styled(TableHeader)`
  padding: 16px;

  width: 30%;
`;

const ValueHeaderForVariant = styled(TableHeader)`
  padding: 16px;

  width: 28%;
`;

export const TransactionTableHeader: React.FC<TransactionTableHeaderProps> = ({
  time,
  asset,
  account,
  wallet,
  walletAndAccount,
  amount,
  value,
  onSort,
  $ascending,
  selected,
  isSmallScreen,
  variant,
}) => {
  const headers: TableHeaderComponentProps['headers'] = useMemo(() => {
    let result = [];
    if (variant === 'withNoAssetColumn') {
      result = [
        {
          name: 'time',
          Wrapper: TimeHeader as any,
          isSortable: true,
          text: time,
        },
        {
          name: 'wallet',
          Wrapper: AssetHeader as any,
          isSortable: true,
          text: wallet,
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
    } else if (variant === 'withTimeAndValues') {
      result = [
        {
          name: 'time',
          Wrapper: TimeHeaderForVariant as any,
          isSortable: true,
          text: time,
        },
        {
          name: 'amount',
          Wrapper: AmountHeaderForVariant as any,
          isSortable: true,
          text: amount,
        },
        {
          name: 'value',
          Wrapper: ValueHeaderForVariant as any,
          isSortable: true,
          text: value,
        },
      ];
    } else {
      result = [
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
          name: 'walletAndAccount',
          Wrapper: AccountHeader as any,
          isSortable: true,
          text: walletAndAccount,
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
    }

    if (isSmallScreen && variant !== 'withTimeAndValues') {
      // Remove account and value headers
      result.splice(2, 1);
      result.splice(3, 1);
    }

    return result;
  }, [
    time,
    asset,
    account,
    walletAndAccount,
    variant,
    wallet,
    amount,
    value,
    isSmallScreen,
  ]);

  return (
    <TableHeaderComponent
      headers={headers}
      onSort={onSort as any}
      selected={selected}
      $ascending={$ascending}
    />
  );
};

TransactionTableHeader.defaultProps = {
  variant: 'default',
};
