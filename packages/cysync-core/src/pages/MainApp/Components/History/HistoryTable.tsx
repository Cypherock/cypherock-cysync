import React, { useEffect, useState, useCallback } from 'react';
import {
  WidthProps,
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
  NoSearchResult,
  Container,
  Button,
  ArrowUp,
  ArrowDown,
  AccordionContent,
} from '@cypherock/cysync-ui';
import { selectLanguage, useAppDispatch, useAppSelector } from '~/store';
import { openHistoryDialog } from '~/actions';

type TableHeaderNames = 'Time' | 'Asset' | 'Account' | 'Amount' | 'Value';

interface HeadersData {
  comparator: (a: any, b: any) => number;
  width?: WidthProps['width'];
  padding?: string;
  space?: string;
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
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const lang = useAppSelector(selectLanguage);
  const history = lang.strings.history.search;

  const [sortedBy, setSortedBy] = useState<TableHeaderNames>('Asset');
  const [isAscending, setIsAscending] = useState(true);
  const [selectedDate, setSelectedDate] = useState<string | undefined>(
    undefined,
  );
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [searchQuery, setSearchQuery] = useState('');
  const [openedAccordion, setOpenedAccordion] = useState<string | undefined>(
    undefined,
  );

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
  const [originalData] = useState<DataItem[]>(data);

  const handleDateChange = (value: string) => {
    setSelectedDate(value);
  };

  const handleAccordionToggle = (combinedIndex: string) => {
    if (openedAccordion === combinedIndex) {
      setOpenedAccordion(undefined);
    } else {
      setOpenedAccordion(combinedIndex);
    }
  };

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

  const isSmallScreen = windowWidth < 1440;

  const headersData: Record<TableHeaderNames, HeadersData> = {
    Time: {
      space: '88',
      width: { def: 300, lg: 300 },
      $noFlex: true,
      comparator: createComparator('time'),
    },
    Asset: {
      width: { def: 200, lg: 250 },
      $noFlex: true,
      comparator: createComparator('asset'),
    },
    Account: {
      width: { lg: 425 },
      $noFlex: true,
      comparator: createComparator('account'),
    },
    Amount: {
      padding: '16px 0px 16px 40px',
      comparator: createComparator('amount'),
    },
    Value: {
      padding: '16px 0px 16px 40px',
      comparator: createComparator('value'),
    },
  };

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

  const handleSearch = useCallback(
    (query: string) => {
      setSearchQuery(query);
      const lowercasedQuery = query.toLowerCase();
      if (!lowercasedQuery) {
        setData(originalData);
        return;
      }

      const filteredData = originalData
        .map(dataItem => {
          const filteredRows = dataItem.rows.filter(row =>
            ['asset', 'wallet', 'account', 'symbol', 'type'].some(key =>
              (row as any)[key].toLowerCase().includes(lowercasedQuery),
            ),
          );
          return { ...dataItem, rows: filteredRows };
        })
        .filter(dataItem => dataItem.rows.length > 0);

      setData(filteredData);
    },
    [originalData],
  );

  useEffect(() => {
    const sortedData = sortData(data, sortedBy);
    setData(sortedData);
  }, [isAscending, sortedBy]);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <>
      <TableSearchFilter
        placeholder={history.placeholder}
        dateValue={selectedDate}
        dateChange={handleDateChange}
        value={searchQuery}
        onChange={e => handleSearch(e.target.value)}
        onClear={() => handleSearch('')}
        searched={Boolean(searchQuery !== '')}
      />
      {data.length !== 0 ? (
        <>
          <TableHeader width="full">
            {Object.keys(headersData).map(headerName => {
              if (
                isSmallScreen &&
                (headerName === 'Account' || headerName === 'Value')
              ) {
                return null;
              }
              const header = headersData[headerName as TableHeaderNames];
              return (
                <TableHeaderData
                  key={headerName}
                  data={headerName}
                  onClick={handleHeaderClick as any}
                  $ascending={isAscending}
                  width={header.width}
                  p={header.padding}
                  pl={isSmallScreen ? header.space : undefined}
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
                  <>
                    <TableDataRow
                      onClick={() => {
                        dispatch(openHistoryDialog(row));
                      }}
                      width="full"
                      key={row.id}
                      $index={rowIndex}
                      $last={
                        openedAccordion !== `${dataIndex}-${rowIndex}` &&
                        dataIndex === data.length - 1 &&
                        rowIndex === dataItem.rows.length - 1
                      }
                    >
                      <HistoryNameBox
                        icon={row.icon}
                        fill={row.fill}
                        variant="grey"
                        pl={isSmallScreen ? 3 : undefined}
                        title={row.type}
                        $textColor={row.typeColor ?? undefined}
                        subtitle={row.time}
                        date={row.date}
                      />
                      <HistoryAssetBox
                        size="small"
                        asset={row.asset}
                        width={isSmallScreen ? 200 : 250}
                        p={isSmallScreen ? 2 : undefined}
                      />
                      {!isSmallScreen && (
                        <HistoryAssetBox
                          wallet={row.wallet}
                          size="big"
                          asset={row.account}
                        />
                      )}
                      <TableNameBox text={`${row.amount} ${row.symbol}`} />
                      {!isSmallScreen && (
                        <TableNameBox text={`$${row.value}`} />
                      )}
                      {isSmallScreen && (
                        <Container
                          display="flex"
                          justify="flex-end"
                          align="center"
                          $alignSelf="stretch"
                          pr={3}
                        >
                          <Button
                            variant="none"
                            position="absolute"
                            $zIndex={1}
                            onClick={event => {
                              event.stopPropagation();
                              handleAccordionToggle(`${dataIndex}-${rowIndex}`);
                            }}
                          >
                            {openedAccordion === `${dataIndex}-${rowIndex}` ? (
                              <ArrowUp />
                            ) : (
                              <ArrowDown />
                            )}
                          </Button>
                        </Container>
                      )}
                    </TableDataRow>
                    {isSmallScreen &&
                      openedAccordion === `${dataIndex}-${rowIndex}` && (
                        <AccordionContent
                          headers={[
                            `${Object.keys(headersData)[2]}`,
                            `${Object.keys(headersData)[4]}`,
                          ]}
                          items={[
                            {
                              component: (
                                <HistoryAssetBox
                                  wallet={row.wallet}
                                  size="big"
                                  pl="88"
                                  asset={row.account}
                                />
                              ),
                              width: 425,
                              padding: 16,
                              paddingLeft: '88',
                            },
                            {
                              component: (
                                <TableNameBox text={`$${row.value}`} />
                              ),
                            },
                          ]}
                          $last={
                            dataIndex === data.length - 1 &&
                            rowIndex === dataItem.rows.length - 1
                          }
                        />
                      )}
                  </>
                ))}
              </>
            ))}
          </TableBody>
        </>
      ) : (
        <NoSearchResult
          text={`${history.notFound.text} "${searchQuery}"`}
          subText={history.notFound.subText}
        />
      )}
    </>
  );
};
