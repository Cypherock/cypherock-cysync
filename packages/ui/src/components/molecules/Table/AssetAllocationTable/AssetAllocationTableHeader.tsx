import React, { useMemo } from 'react';
import { styled } from 'styled-components';

import {
  TableHeader,
  TableHeaderComponent,
  TableHeaderComponentProps,
} from '../TableStyles';

export type AssetAllocationTableHeaderName =
  | 'asset'
  | 'price'
  | 'balance'
  | 'value'
  | 'allocation';

export interface AssetAllocationTableHeaderProps {
  asset: string;
  price: string;
  balance: string;
  value: string;
  allocation: string;
  onSort: (key: AssetAllocationTableHeaderName) => void;
  selected: AssetAllocationTableHeaderName;
  $ascending: boolean;
}

const AssetHeader = styled(TableHeader)`
  padding: 16px;
  padding-left: 40px;

  width: 26%;
  @media ${({ theme }) => theme.screens.lg} {
    width: 24%;
  }
`;

const PriceHeader = styled(TableHeader)`
  padding: 16px;

  width: 18%;
  @media ${({ theme }) => theme.screens.lg} {
    padding-left: 40px;
  }
`;

const BalanceHeader = styled(TableHeader)`
  padding: 16px;

  width: 18%;
  @media ${({ theme }) => theme.screens.lg} {
    padding-left: 40px;
  }
`;

const ValueHeader = styled(TableHeader)`
  padding: 16px;

  width: 18%;
  @media ${({ theme }) => theme.screens.lg} {
    padding-left: 40px;
  }
`;

const AllocationHeader = styled(TableHeader)`
  padding: 16px;

  width: 20%;
  @media ${({ theme }) => theme.screens.lg} {
    padding-left: 40px;
    width: 24%;
  }
`;

export const AssetAllocationTableHeader: React.FC<
  AssetAllocationTableHeaderProps
> = ({
  allocation,
  balance,
  price,
  asset,
  value,
  onSort,
  $ascending,
  selected,
}) => {
  const headers: TableHeaderComponentProps['headers'] = useMemo(
    () => [
      {
        name: 'asset',
        Wrapper: AssetHeader as any,
        isSortable: true,
        text: asset,
      },
      {
        name: 'price',
        Wrapper: PriceHeader as any,
        isSortable: true,
        text: price,
      },
      {
        name: 'balance',
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
      {
        name: 'allocation',
        Wrapper: AllocationHeader as any,
        isSortable: true,
        text: allocation,
      },
    ],
    [asset, value, price, balance, allocation],
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
