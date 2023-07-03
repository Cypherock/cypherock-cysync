import {
  AllocationShare,
  AssetIconNameBox,
  NameBox,
  NameVariants,
  TableBody,
  TableBox,
  TableBoxDataRow,
  TableBoxHeader,
  TableBoxHeaderData,
  TableBoxTitle,
  Typography,
} from '@cypherock/cysync-ui';
import React, { useEffect, useState } from 'react';

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
  const [sortedBy, setSortedBy] = React.useState(headersData[0].name);
  const [ascending, setAscending] = useState(true);
  const [data, setData] = useState<AssetDataType[]>([
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
      amount: '0.0179 ETH',
      value: '$45.4527',
      allocation: 74.47,
    },
  ]);

  const handleClick = (columnName: string) => {
    if (sortedBy === columnName) {
      setAscending(!ascending);
      return;
    }
    setSortedBy(columnName);
    setAscending(true);
  };

  const comparator = (a: AssetDataType, b: AssetDataType) => {
    if (sortedBy === 'Asset') {
      return ascending
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name);
    }
    if (sortedBy === 'Price') {
      return ascending
        ? parseFloat(a.price.replace('$ ', '')) -
            parseFloat(b.price.replace('$ ', ''))
        : parseFloat(b.price.replace('$ ', '')) -
            parseFloat(a.price.replace('$ ', ''));
    }
    if (sortedBy === 'Amount') {
      return ascending
        ? parseFloat(a.amount.replace(' BTC', '')) -
            parseFloat(b.amount.replace(' BTC', ''))
        : parseFloat(b.amount.replace(' BTC', '')) -
            parseFloat(a.amount.replace(' BTC', ''));
    }
    if (sortedBy === 'Value') {
      return ascending
        ? parseFloat(a.value.replace('$', '')) -
            parseFloat(b.value.replace('$', ''))
        : parseFloat(b.value.replace('$', '')) -
            parseFloat(a.value.replace('$', ''));
    }
    if (sortedBy === 'Allocation') {
      return ascending
        ? a.allocation - b.allocation
        : b.allocation - a.allocation;
    }
    return 0;
  };

  useEffect(() => {
    setData(data.sort(comparator));
  }, [ascending, sortedBy, data]);

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
            $ascending={ascending}
            width={header.width}
            p={header.padding}
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
            width="full"
          >
            <AssetIconNameBox
              name={asset.name}
              symbol={asset.symbol}
              size="big"
            />
            <NameBox text={asset.price} />
            <NameBox text={asset.value} />
            <NameBox text={asset.amount} />
            <AllocationShare
              percentage={asset.allocation}
              variant={asset.name}
              size="big"
            />
          </TableBoxDataRow>
        ))}
      </TableBody>
    </TableBox>
  );
};
