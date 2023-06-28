import {
  AllocationShare,
  IconNameBox,
  NameBox,
  TableBody,
  TableBox,
  TableBoxDataRow,
  TableBoxHeader,
  TableBoxHeaderData,
  TableBoxTitle,
  NameVariants,
  Typography,
} from '@cypherock/cysync-ui';
import React, { useState } from 'react';

interface HeadersData {
  name: string;
  width?: string;
  padding?: string;
  $noFlex?: boolean;
}

const headersData: HeadersData[] = [
  {
    name: 'Asset',
    padding: '16px 20px 16px 96px',
    width: '300',
    $noFlex: true,
  },
  {
    name: 'Price',
  },
  {
    name: 'Amount',
  },
  {
    name: 'Value',
  },
  {
    name: 'Allocation',
    width: '300',
    $noFlex: true,
  },
];

interface AssetDataType {
  name: NameVariants;
  symbol: string;
  price: string;
  amount: string;
  value: string;
  allocation: number;
}

export const AssetAllocation = () => {
  const data: AssetDataType[] = [
    {
      name: 'Bitcoin',
      symbol: 'BTC',
      price: '$ 16981.44',
      amount: '0.0178 BTC',
      value: '$2.9827',
      allocation: 23.55,
    },
    {
      name: 'Ethereum',
      symbol: 'ETH',
      price: '$ 674.44',
      amount: '0.0178 ETH',
      value: '$45.4527',
      allocation: 74.47,
    },
  ];
  const [sortedBy, setSortedBy] = React.useState(headersData[0].name);
  const [ascending, setAscending] = useState(true);

  const handleClick = (columnName: string) => {
    if (sortedBy === columnName) {
      setAscending(!ascending);
      return;
    }
    setSortedBy(columnName);
    setAscending(true);
  };

  return (
    <TableBox width="full">
      <TableBoxTitle width="full">
        <Typography variant="h5" color="muted">
          Asset Allocation
        </Typography>
      </TableBoxTitle>
      <TableBoxHeader width="full">
        {headersData.map(header => (
          <TableBoxHeaderData
            key={header.name}
            data={header.name}
            onClick={handleClick}
            ascending={ascending}
            width={header.width}
            padding={header.padding}
            $noFlex={header.$noFlex}
            selected={sortedBy === header.name}
          />
        ))}
      </TableBoxHeader>
      <TableBody width="full">
        {data.map((asset, index) => (
          <TableBoxDataRow
            key={asset.name}
            $last={index === data.length - 1}
            index={index}
            width="full"
          >
            <IconNameBox name={asset.name} symbol={asset.symbol} />
            <NameBox text={asset.price} />
            <NameBox text={asset.value} />
            <NameBox text={asset.amount} />
            <AllocationShare
              percentage={asset.allocation}
              variant={asset.name}
            />
          </TableBoxDataRow>
        ))}
      </TableBody>
    </TableBox>
  );
};
