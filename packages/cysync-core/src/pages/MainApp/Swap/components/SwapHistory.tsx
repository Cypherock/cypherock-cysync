import { createCSVFromSwap } from '@cypherock/cysync-core-services';
import {
  TableGroupRow,
  NoAccountWrapper,
  SkeletonLoader,
  ArrowReceivedIcon,
  TableStructure,
  TableSearchFilter,
  NoSearchResult,
  NotFound,
  Container,
  useTheme,
  SwapTableRow,
  SwapTableHeader,
  GraphSwitchSmallIcon,
} from '@cypherock/cysync-ui';
import React, { useEffect, useRef } from 'react';
import * as Virtualize from 'react-virtualized/dist/umd/react-virtualized';

import { openReceiveDialog } from '~/actions';
import { useSwapTransactions, useWindowSize } from '~/hooks';
import { useAppSelector, selectLanguage } from '~/store';
import { downloadCSVToDesktop } from '~/utils';

export const SwapHistory = ({ topbarHeight }: { topbarHeight: number }) => {
  const {
    strings,
    dispatch,
    searchTerm,
    setSearchTerm,
    transactionList,
    isAscending,
    sortedBy,
    onSort,
    displayedData,
    handleTransactionTableRow,
  } = useSwapTransactions();
  const theme = useTheme();
  const { windowHeight } = useWindowSize();
  const listRef = useRef<any>(null);
  const lang = useAppSelector(selectLanguage);

  useEffect(() => {
    if (listRef.current?.recomputeRowHeights) {
      listRef.current.recomputeRowHeights();
    }
  }, [displayedData]);

  const rowRenderer = ({ key, index, style }: any) => {
    const row = displayedData[index];

    if (row.isGroupHeader) {
      return (
        <TableGroupRow key={key} style={style} text={row.groupText ?? ''} />
      );
    }

    return (
      <SwapTableRow
        id={row.swapId}
        providerName={row.providerName}
        providerImageUrl={row.providerImageUrl}
        providerUrl={row.providerUrl}
        sourceAssetName={row.sourceAssetName}
        sourceAssetIcon={<row.sourceAssetIcon />}
        destinationAssetName={row.destinationAssetName ?? 'Unknown'}
        destinationAssetIcon={<row.destinationAssetIcon />}
        receivedDisplayAmount={row.receivedDisplayAmount}
        sentDisplayAmount={row.sentDisplayAmount}
        status={row.swapStatus}
        time={row.time}
        date={row.date}
        $rowIndex={index}
        onClick={() => handleTransactionTableRow(row)}
        $isLast={index === displayedData.length - 1}
        icon={GraphSwitchSmallIcon}
      />
    );
  };

  const getRowHeight = ({ index }: { index: number }) => {
    if (displayedData[index].isGroupHeader) {
      return 57;
    }

    return 82;
  };

  const handleDownloadCSV = () => {
    const csvFile = createCSVFromSwap(
      displayedData
        .filter(t => !t.isGroupHeader)
        .map(t => ({
          date: t.timestamp,
          provider: t.providerName,
          providerUrl: t.providerUrl,
          assetFrom: t.sourceAssetName,
          assetFromAmount: t.sentDisplayAmount,
          assetTo: t.destinationAssetName ?? '',
          assetToAmount: t.receivedDisplayAmount,
          status: t.swapStatus,
          walletFrom: t.sourceWalletName,
          accountFrom: t.sourceAccountName,
          walletTo: t.destinationWalletName ?? '',
          accountTo: t.destinationAccountName ?? '',
          swapId: t.swapId,
          sentTransactionHash: t.sentTransactionHash,
          receiveTransactionHash: t.receiveTransactionHash,
        })),
    );
    downloadCSVToDesktop('CySync Swap History.csv', csvFile);
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
          handleDownloadCSV={handleDownloadCSV}
          downloadCSVTooltip={lang.strings.tooltips.downloadCsv}
        />
        {displayedData.length > 0 ? (
          <>
            <SwapTableHeader
              provider="Provider"
              assetFrom="Asset From"
              assetTo="Asset To"
              received="Received"
              sent="Sent"
              onSort={onSort}
              selected={sortedBy}
              $ascending={isAscending}
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
    <Container $noFlex m="20">
      {getMainContent()}
    </Container>
  );
};
