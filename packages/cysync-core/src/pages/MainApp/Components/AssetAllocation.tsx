import { CoinTypes } from '@cypherock/coins';
import {
  AllocationShare,
  Table,
  TableBody,
  TableDataRow,
  TableHeader,
  TableHeaderData,
  TableNameBox,
  TableTitle,
  Typography,
} from '@cypherock/cysync-ui';
import React, { useEffect, useState } from 'react';

import { AssetIconNameBox } from '~/pages/MainApp/Components/AssetIconNameBox';

type TableHeaderNames = 'Asset' | 'Price' | 'Amount' | 'Value' | 'Allocation';

interface HeadersData {
  comparator: (a: any, b: any) => number;
  width?: object;
  padding?: string;
  $noFlex?: boolean;
}

interface AssetDataType {
  id: CoinTypes;
  name: string;
  symbol: string;
  price: number;
  amount: number;
  value: number;
  allocation: number;
  color: string;
}

export const AssetAllocation = () => {
  const [sortedBy, setSortedBy] = React.useState<TableHeaderNames>('Asset');
  const [isAscending, setIsAscending] = useState(true);

  const createComparator =
    (key: keyof AssetDataType) => (a: AssetDataType, b: AssetDataType) => {
      if (a[key] < b[key]) {
        return isAscending ? -1 : 1;
      }
      if (a[key] > b[key]) {
        return isAscending ? 1 : -1;
      }
      return 0;
    };

  const headersData: Record<TableHeaderNames, HeadersData> = {
    Asset: {
      padding: '16px 20px 16px 96px',
      width: { def: 200, lg: 300 },
      $noFlex: true,
      comparator: createComparator('id'),
    },
    Price: {
      comparator: createComparator('price'),
    },
    Amount: {
      comparator: createComparator('amount'),
    },
    Value: {
      comparator: createComparator('value'),
    },
    Allocation: {
      width: { def: 144, lg: 300 },
      $noFlex: true,
      comparator: createComparator('allocation'),
    },
  };

  const [data, setData] = useState<AssetDataType[]>([
    {
      id: 'bitcoin',
      name: 'Bitcoin',
      symbol: 'BTC',
      price: 16981.44,
      amount: 0.0178,
      value: 2.9827,
      allocation: 23.55,
      color: '#F89C2D',
    },
    {
      id: 'ethereum',
      name: 'Ethereum',
      symbol: 'ETH',
      price: 674.44,
      amount: 0.0179,
      value: 45.4527,
      allocation: 74.47,
      color: '#0085FF',
    },
  ]);
  const handleHeaderClick = (columnName: TableHeaderNames) => {
    if (sortedBy === columnName) {
      setIsAscending(!isAscending);
      return;
    }
    setSortedBy(columnName);
    setIsAscending(true);
  };

  useEffect(() => {
    setData(data.sort(headersData[sortedBy].comparator));
  }, [isAscending, sortedBy]);

  return (
    <Table width="full">
      <TableTitle width="full">
        <Typography variant="h5" color="muted">
          Asset Allocation
        </Typography>
      </TableTitle>
      <TableHeader width="full">
        {Object.keys(headersData).map(headerName => {
          const header = headersData[headerName as TableHeaderNames];
          return (
            <TableHeaderData
              key={headerName}
              data={headerName}
              onClick={handleHeaderClick as any}
              $ascending={isAscending}
              width={header.width}
              p={header.padding}
              $noFlex={header.$noFlex}
              selected={sortedBy === headerName}
            />
          );
        })}
      </TableHeader>
      <TableBody width="full">
        {data.map((asset, index) => (
          <TableDataRow
            key={asset.id}
            $last={index === data.length - 1}
            width="full"
          >
            <AssetIconNameBox
              id={asset.id}
              name={asset.name}
              symbol={asset.symbol}
            />
            <TableNameBox text={`$ ${asset.price}`} />
            <TableNameBox text={`${asset.amount} ${asset.symbol}`} />
            <TableNameBox text={`$ ${asset.value}`} />
            <AllocationShare
              percentage={asset.allocation}
              color={asset.color}
            />
          </TableDataRow>
        ))}
      </TableBody>
    </Table>
  );
};
