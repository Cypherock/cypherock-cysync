import React from 'react';
import { styled } from 'styled-components';

import {
  TableHeader,
  TableHeaderComponent,
  TableHeaderComponentProps,
} from '../TableStyles';

export type AccountTableHeaderName = 'account' | 'amount' | 'value';

export interface AccountTableHeaderProps {
  account: string;
  syncStatus: string;
  balance: string;
  value: string;
  onSort: (key: AccountTableHeaderName) => void;
  selected: AccountTableHeaderName;
  $ascending: boolean;
}

const AccountHeader = styled(TableHeader)`
  padding: 16px 16px 16px 80px;

  width: 42%;
  @media ${({ theme }) => theme.screens.mdlg} {
    width: 29%;
    padding: 16px 16px 16px 96px;
  }
`;

const StatusHeader = styled(TableHeader)`
  padding: 16px;
  justify-content: center;
  cursor: unset;

  width: 19%;
  @media ${({ theme }) => theme.screens.mdlg} {
    width: 26%;
    padding: 16px 20px;
  }
`;

const BalanceHeader = styled(TableHeader)`
  padding: 16px;

  width: 19%;
  @media ${({ theme }) => theme.screens.mdlg} {
    width: 26%;
    padding: 16px 20px;
    padding-left: 0;
  }
`;

const ValueHeader = styled(TableHeader)`
  padding: 16px 24px 16px 16px;

  width: 20%;
  @media ${({ theme }) => theme.screens.mdlg} {
    width: 19%;
    padding: 16px 20px 16px 40px;
  }
`;

export const AccountTableHeader: React.FC<AccountTableHeaderProps> = ({
  account,
  syncStatus,
  balance,
  value,
  onSort,
  $ascending,
  selected,
}) => {
  const headers: TableHeaderComponentProps['headers'] = [
    {
      name: 'account',
      Wrapper: AccountHeader as any,
      isSortable: true,
      text: account,
    },
    {
      name: 'sync',
      Wrapper: StatusHeader as any,
      isSortable: false,
      text: syncStatus,
    },
    {
      name: 'amount',
      Wrapper: BalanceHeader as any,
      isSortable: true,
      text: balance,
    },
    {
      name: 'value',
      Wrapper: ValueHeader as any,
      isSortable: true,
      text: value,
    },
  ];

  return (
    <TableHeaderComponent
      headers={headers}
      onSort={onSort as any}
      selected={selected}
      $ascending={$ascending}
    />
  );
};
