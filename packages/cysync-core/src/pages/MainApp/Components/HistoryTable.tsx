import React, { useEffect, useState } from 'react';
import {
  WidthProps,
  Table,
  TableBody,
  TableDataRow,
  TableHeader,
  TableHeaderData,
  TableNameBox,
  HistoryDateBox,
  useTheme,
  HistoryNameBox,
  ArrowReceivedIcon,
  ArrowSentIcon,
  TypographyColor,
  HistoryAssetBox,
  TableSearchFilter,
  SvgProps,
} from '@cypherock/cysync-ui';
import { useAppDispatch } from '~/store';
import { openHistoryDialog } from '~/actions';

type TableHeaderNames = 'Time' | 'Asset' | 'Account' | 'Amount' | 'Value';

interface HeadersData {
  comparator: (a: any, b: any) => number;
  width?: WidthProps['width'];
  padding?: string;
  $noFlex?: boolean;
}

export interface Row {
  id: number;
  fill: string;
  type: string;
  status: string;
  icon: React.FC<SvgProps>;
  typeColor?: TypographyColor;
  time: string;
  timeStamp: string;
  date?: string;
  asset: string;
  wallet: string;
  account: string;
  amount: number;
  symbol: string;
  value: number;
  feeEth: number;
  feeDollar: number;
  hash: string;
}

interface DataItem {
  day: string;
  rows: Row[];
}

type ComparableKeys =
  | 'id'
  | 'type'
  | 'time'
  | 'asset'
  | 'wallet'
  | 'account'
  | 'amount'
  | 'symbol'
  | 'value';

export const HistoryTable = () => {
  const [sortedBy, setSortedBy] = React.useState<TableHeaderNames>('Asset');
  const [isAscending, setIsAscending] = useState(true);
  const theme = useTheme();
  const dispatch = useAppDispatch();

  const createComparator = (key: ComparableKeys) => (a: Row, b: Row) => {
    const aValue = a[key];
    const bValue = b[key];

    if (aValue === undefined || bValue === undefined) return 0;

    if (aValue < bValue) {
      return isAscending ? -1 : 1;
    }
    if (aValue > bValue) {
      return isAscending ? 1 : -1;
    }
    return 0;
  };

  const headersData: Record<TableHeaderNames, HeadersData> = {
    Time: {
      padding: '16px 20px 16px 40px',
      width: { def: 300, lg: 300 },
      $noFlex: true,
      comparator: createComparator('time'),
    },
    Asset: {
      width: { def: 250, lg: 250 },
      $noFlex: true,
      comparator: createComparator('asset'),
    },
    Account: {
      width: { def: 425, lg: 425 },
      $noFlex: true,
      comparator: createComparator('account'),
    },
    Amount: {
      comparator: createComparator('amount'),
    },
    Value: {
      comparator: createComparator('value'),
    },
  };

  const [data, setData] = useState<DataItem[]>([
    {
      day: 'Saturday, MARCH 11 2023',
      rows: [
        {
          id: 1,
          icon: ArrowReceivedIcon,
          fill: theme.palette.text.success,
          type: 'Received',
          status: 'Success',
          time: '1:10 PM',
          date: '03/11/23',
          timeStamp: 'Saturday, March 11 2023 1:10 PM',
          asset: 'Ethereum',
          wallet: 'Cypherock Red',
          account: 'Ethereum 1',
          amount: 0.0178,
          symbol: 'ETH',
          value: 2.9827,
          feeEth: 0.0004443,
          feeDollar: 0.569,
          hash: '0x23ab56asd7nsd38242hfu23472634hdf893',
        },
        {
          id: 2,
          icon: ArrowSentIcon,
          fill: theme.palette.text.success,
          type: 'Sent',
          status: 'Success',
          time: '1:30 PM',
          timeStamp: 'Saturday, March 11 2023 1:30 PM',
          asset: 'Bitcoin',
          wallet: 'Cypherock Red',
          account: 'Bitcoin 2',
          amount: 0.0178,
          symbol: 'BTC',
          value: 45.4527,
          feeEth: 0.0004443,
          feeDollar: 0.569,
          hash: '0x23ab56asd7nsd38242hfu23472634hdf893',
        },
        {
          id: 3,
          icon: ArrowReceivedIcon,
          fill: theme.palette.text.warn,
          type: 'Sent Pending',
          status: 'Pending',
          typeColor: 'warn',
          time: '1:48 PM',
          timeStamp: 'Saturday, March 11 2023 1:48 PM',
          asset: 'Tether',
          wallet: 'Cypherock Red',
          account: 'Ethereum 1',
          amount: 0.0178,
          symbol: 'USDT',
          value: 2.9827,
          feeEth: 0.0004443,
          feeDollar: 0.569,
          hash: '0x23ab56asd7nsd38242hfu23472634hdf893',
        },
        {
          id: 4,
          icon: ArrowReceivedIcon,
          fill: theme.palette.text.success,
          type: 'Received',
          status: 'Success',
          time: '2:14 PM',
          timeStamp: 'Saturday, March 11 2023 2:14 PM',
          asset: 'Ethereum',
          wallet: 'Cypherock Red',
          account: 'Ethereum 3',
          amount: 0.0178,
          symbol: 'ETH',
          value: 45.4527,
          feeEth: 0.0004443,
          feeDollar: 0.569,
          hash: '0x23ab56asd7nsd38242hfu23472634hdf893',
        },
        {
          id: 5,
          icon: ArrowReceivedIcon,
          fill: theme.palette.text.success,
          type: 'Received',
          status: 'Success',
          time: '1:10 PM',
          timeStamp: 'Saturday, March 11 2023 1:10 PM',
          asset: 'Ethereum',
          wallet: 'Cypherock Red',
          account: 'Ethereum 2',
          amount: 0.0178,
          symbol: 'ETH',
          value: 2.9827,
          feeEth: 0.0004443,
          feeDollar: 0.569,
          hash: '0x23ab56asd7nsd38242hfu23472634hdf893',
        },
      ],
    },
    {
      day: 'Wednesday, MARCH 09 2023',
      rows: [
        {
          id: 1,
          icon: ArrowSentIcon,
          fill: theme.palette.text.error,
          type: 'Sent Failed',
          status: 'Failed',
          typeColor: 'error',
          time: '1:48 PM',
          timeStamp: 'Saturday, March 09 2023 1:48 PM',
          asset: 'Tether',
          wallet: 'Cypherock Red',
          account: 'Ethereum 1',
          amount: 0.0178,
          symbol: 'USDT',
          value: 2.9827,
          feeEth: 0.0004443,
          feeDollar: 0.569,
          hash: '0x23ab56asd7nsd38242hfu23472634hdf893',
        },
        {
          id: 2,
          icon: ArrowSentIcon,
          fill: theme.palette.text.error,
          type: 'Sent Failed',
          status: 'Failed',
          typeColor: 'error',
          time: '1:30 PM',
          timeStamp: 'Saturday, March 09 2023 1:30 PM',
          asset: 'Bitcoin',
          wallet: 'Cypherock Red',
          account: 'Bitcoin 2',
          amount: 0.0178,
          symbol: 'BTC',
          value: 2.9827,
          feeEth: 0.0004443,
          feeDollar: 0.569,
          hash: '0x23ab56asd7nsd38242hfu23472634hdf893',
        },
        {
          id: 3,
          icon: ArrowReceivedIcon,
          fill: theme.palette.text.success,
          type: 'Received',
          status: 'Success',
          time: '1:48 PM',
          timeStamp: 'Saturday, March 09 2023 1:48 PM',
          asset: 'Tether',
          wallet: 'Cypherock Red',
          account: 'Ethereum 1',
          amount: 0.0178,
          symbol: 'USDT',
          value: 2.9827,
          feeEth: 0.0004443,
          feeDollar: 0.569,
          hash: '0x23ab56asd7nsd38242hfu23472634hdf893',
        },
      ],
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

  const sortData = (
    inputData: DataItem[],
    columnName: TableHeaderNames,
  ): DataItem[] => {
    const { comparator } = headersData[columnName];
    return inputData.map(dataItem => ({
      ...dataItem,
      rows: dataItem.rows.sort(comparator),
    }));
  };

  useEffect(() => {
    const sortedData = sortData(data, sortedBy);
    setData(sortedData);
  }, [isAscending, sortedBy]);

  return (
    <Table width="full">
      <TableSearchFilter />
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
        {data.map((dataItem, dataIndex) => (
          <>
            <HistoryDateBox text={dataItem.day} />
            {dataItem.rows.map((row, rowIndex) => (
              <TableDataRow
                onClick={() => {
                  dispatch(openHistoryDialog(row));
                }}
                width="full"
                key={row.id}
                $index={rowIndex}
                $last={
                  dataIndex === data.length - 1 &&
                  rowIndex === dataItem.rows.length - 1
                }
              >
                <HistoryNameBox
                  icon={row.icon}
                  fill={row.fill}
                  iconVariant="grey"
                  title={row.type}
                  textColor={row.typeColor ?? undefined}
                  subtitle={row.time}
                  date={row.date}
                />
                <HistoryAssetBox size="small" asset={row.asset} />
                <HistoryAssetBox
                  wallet={row.wallet}
                  size="big"
                  asset={row.account}
                />
                <TableNameBox text={`${row.amount} ${row.symbol}`} />
                <TableNameBox text={`$${row.value}`} />
              </TableDataRow>
            ))}
          </>
        ))}
      </TableBody>
    </Table>
  );
};
