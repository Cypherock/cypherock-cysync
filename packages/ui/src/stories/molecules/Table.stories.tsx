import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

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
} from '../../components';

const meta: Meta<typeof Table> = {
  component: Table,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof meta>;
type TableHeaderNames = 'Price' | 'Amount' | 'Value' | 'Allocation';

const data = [
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
];

const headersData: Record<TableHeaderNames, any> = {
  Price: {
    selected: true,
  },
  Amount: {
    selected: false,
  },
  Value: {
    selected: false,
  },
  Allocation: {
    width: { def: 144, lg: 300 },
    $noFlex: true,
    selected: false,
  },
};

export const Default: Story = {
  args: {
    width: 'full',
    children: (
      <>
        <TableTitle width="full">
          <Typography variant="h5" color="muted">
            Table Title
          </Typography>
        </TableTitle>
        <TableHeader width="full">
          {Object.keys(headersData).map(headerName => {
            const header = headersData[headerName as TableHeaderNames];
            return (
              <TableHeaderData
                key={headerName}
                data={headerName}
                width={header.width}
                p={header.padding}
                $noFlex={header.$noFlex}
                $ascending
                onClick={() => null}
                selected={header.selected}
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
      </>
    ),
  },
};
