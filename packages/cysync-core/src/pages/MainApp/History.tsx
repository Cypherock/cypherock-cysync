import {
  ArrowReceivedIcon,
  Container,
  NoAccountWrapper,
  SkeletonLoader,
  useTheme,
  TableStructure,
  TableSearchFilter,
  NoSearchResult,
  NotFound,
  TransactionTableHeader,
  TransactionTableRow,
  TableGroupRow,
} from '@cypherock/cysync-ui';
import React, { FC, useEffect, useRef, useState } from 'react';
import * as Virtualize from 'react-virtualized/dist/umd/react-virtualized';

import { openReceiveDialog } from '~/actions';
import { useTransactions, useWindowSize } from '~/hooks';

import { MainAppLayout } from './Layout';

export const History: FC = () => {
  const {
    strings,
    displayedData,
    dispatch,
    searchTerm,
    setSearchTerm,
    transactionList,
    handleTransactionTableRow,
    isAscending,
    sortedBy,
    onSort,
    isSmallScreen,
    expandedRowIds,
    onRowExpand,
  } = useTransactions();
  const theme = useTheme();
  const { windowHeight } = useWindowSize();
  const [topbarHeight, setTopbarHeight] = useState(0);
  const listRef = useRef<any>(null);

  useEffect(() => {
    if (listRef.current?.recomputeRowHeights) {
      listRef.current.recomputeRowHeights();
    }
  }, [expandedRowIds, isSmallScreen, displayedData]);

  const rowRenderer = ({ key, index, style }: any) => {
    const row = displayedData[index];

    if (row.isGroupHeader) {
      return (
        <TableGroupRow key={key} style={style} text={row.groupText ?? ''} />
      );
    }

    return (
      <TransactionTableRow
        style={style}
        key={key}
        id={row.id}
        icon={row.icon}
        assetIcon={<row.assetIcon width="24px" height="24px" />}
        accountIcon={<row.accountIcon width="16px" height="16px" />}
        type={row.type}
        status={row.status}
        time={row.time}
        asset={row.assetName}
        wallet={row.walletName}
        account={row.accountName}
        accountTag={row.accountTag}
        amount={row.displayAmount}
        amountTooltip={row.amountTooltip}
        value={row.displayValue}
        $isLast={index === displayedData.length - 1}
        $rowIndex={index}
        onClick={() => handleTransactionTableRow(row)}
        isSmallScreen={isSmallScreen}
        accountHeader={strings.history.tableHeader.account}
        valueHeader={strings.history.tableHeader.value}
        isExpanded={expandedRowIds[row.id]}
        setIsExpanded={value => onRowExpand(row, value)}
      />
    );
  };

  const getRowHeight = ({ index }: { index: number }) => {
    if (displayedData[index].isGroupHeader) {
      return 57;
    }

    return expandedRowIds[displayedData[index].id] && isSmallScreen ? 198 : 82;
  };

  const getMainContent = () => {
    if (transactionList.length <= 0)
      return (
        <NoAccountWrapper>
          <SkeletonLoader
            loader={<ArrowReceivedIcon fill={theme.palette.text.success} />}
            text={strings.history.noData.text}
            subText={strings.history.noData.subText}
            $buttonOne={strings.history.noData.buttonText}
            onClick={() => dispatch(openReceiveDialog())}
          />
        </NoAccountWrapper>
      );

    return (
      <TableStructure>
        <TableSearchFilter
          placeholder={strings.history.search.placeholder}
          value={searchTerm}
          onChange={setSearchTerm}
        />
        {displayedData.length > 0 ? (
          <>
            <TransactionTableHeader
              time={strings.history.tableHeader.time}
              account={strings.history.tableHeader.account}
              wallet={strings.history.tableHeader.wallet}
              walletAndAccount={strings.history.tableHeader.walletAndAccount}
              asset={strings.history.tableHeader.asset}
              value={strings.history.tableHeader.value}
              amount={strings.history.tableHeader.amount}
              $ascending={isAscending}
              selected={sortedBy}
              onSort={onSort}
              isSmallScreen={isSmallScreen}
            />
            <Virtualize.AutoSizer>
              {({ width }: any) => (
                <Virtualize.List
                  ref={listRef}
                  height={windowHeight - topbarHeight - 173 - 20}
                  width={width}
                  rowCount={displayedData.length}
                  rowHeight={getRowHeight}
                  rowRenderer={rowRenderer}
                />
              )}
            </Virtualize.AutoSizer>
          </>
        ) : (
          <NoSearchResult
            image={<NotFound />}
            text={strings.history.search.notFound.text}
            subText={strings.history.search.notFound.subText}
            searchText={searchTerm}
          />
        )}
      </TableStructure>
    );
  };

  return (
    <MainAppLayout
      topbar={{ title: strings.sidebar.history }}
      onTopbarHeightChange={setTopbarHeight}
    >
      <Container $noFlex m="20">
        {getMainContent()}
      </Container>
    </MainAppLayout>
  );
};
