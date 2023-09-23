import React, { useMemo } from 'react';
import { styled } from 'styled-components';

import {
  TableHeader,
  TableHeaderComponent,
  TableHeaderComponentProps,
} from '../TableStyles';

export type TokenTableHeaderName = 'token' | 'amount' | 'value';

export interface TokenTableHeaderProps {
  token: string;
  amount: string;
  value: string;
  onSort: (key: TokenTableHeaderName) => void;
  selected: TokenTableHeaderName;
  $ascending: boolean;
}

const AssetHeader = styled(TableHeader)`
  padding: 16px;
  padding-left: 40px;

  width: 38%;
`;

const BalanceHeader = styled(TableHeader)`
  padding: 16px;

  width: 32%;
  @media ${({ theme }) => theme.screens.lg} {
    padding-left: 40px;
  }
`;

const ValueHeader = styled(TableHeader)`
  padding: 16px;

  width: 32%;
  @media ${({ theme }) => theme.screens.lg} {
    padding-left: 40px;
  }
`;

export const TokenTableHeader: React.FC<TokenTableHeaderProps> = ({
  value,
  amount,
  token,
  onSort,
  $ascending,
  selected,
}) => {
  const headers: TableHeaderComponentProps['headers'] = useMemo(
    () => [
      {
        name: 'token',
        Wrapper: AssetHeader as any,
        isSortable: true,
        text: token ?? '',
      },
      {
        name: 'amount',
        Wrapper: BalanceHeader as any,
        isSortable: true,
        text: amount ?? '',
      },
      {
        name: 'value',
        Wrapper: ValueHeader as any,
        isSortable: true,
        text: value,
      },
    ],
    [value, amount, token],
  );

  return (
    <TableHeaderComponent
      headers={headers}
      onSort={onSort as any}
      selected={selected}
      $ascending={$ascending}
    />
  );
};
