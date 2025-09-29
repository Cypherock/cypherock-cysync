import { syncBuySellOrdersCore } from '@cypherock/cysync-core-services';
import {
  Flex,
  TableSearchFilter,
  TableStructure,
  BuySellTableHeader,
  BuySellTableRow,
  NoAccountWrapper,
  SkeletonLoader,
  ArrowReceivedIcon,
  NoSearchResult,
  NotFound,
  TableGroupRow,
} from '@cypherock/cysync-ui';
import { theme } from '@cypherock/cysync-ui/dist/esm/themes/theme.styled';
import React, { useEffect, useRef } from 'react';
import * as Virtualize from 'react-virtualized/dist/umd/react-virtualized';

import { useBuySell2 } from '~/context';
import { useBuySellOrders, useWindowSize } from '~/hooks';
import { selectLanguage, useAppSelector } from '~/store';
import { getDB } from '~/utils';

import { BuySellPage } from '.';

export const BuySellHistory = ({ topbarHeight }: { topbarHeight: number }) => {
  const { strings: langStrings } = useAppSelector(selectLanguage);
  const { toPage, setNavigationOptions } = useBuySell2();
  const {
    isLoaded,
    displayedData,
    searchTerm,
    setSearchTerm,
    onSort,
    sortedBy,
    isAscending,
    handleTransactionTableRow,
  } = useBuySellOrders();

  const { windowHeight } = useWindowSize();

  const strings = langStrings.buySell2.history;

  const listRef = useRef<any>(null);

  useEffect(() => {
    setNavigationOptions({
      onBack() {
        toPage(BuySellPage.Input);
      },
      onRefresh() {
        const db = getDB();
        syncBuySellOrdersCore({ db });
      },
    });

    return () => {
      setNavigationOptions({
        onBack: undefined,
        onRefresh: undefined,
      });
    };
  }, []);

  useEffect(() => {
    if (listRef.current?.recomputeRowHeights) {
      listRef.current.recomputeRowHeights();
    }
  }, [displayedData]);

  if (!isLoaded)
    return (
      <NoAccountWrapper>
        <SkeletonLoader
          loader={<ArrowReceivedIcon fill={theme.palette.text.success} />}
          text={strings.state.loading}
        />
      </NoAccountWrapper>
    );

  if (displayedData.length <= 0 && searchTerm.length === 0)
    return (
      <NoAccountWrapper>
        <SkeletonLoader
          loader={<ArrowReceivedIcon fill={theme.palette.text.success} />}
          text={strings.noData.text}
          subText={strings.noData.subText}
          $buttonOne={strings.noData.buttonText}
          onClick={() => toPage(BuySellPage.Input)}
        />
      </NoAccountWrapper>
    );

  const handleDownloadCSV = () => undefined;

  const getRowHeight = ({ index }: { index: number }) => {
    if (displayedData[index].isGroupHeader) {
      return 57;
    }

    return 82;
  };

  const rowRenderer = ({ key, index, style }: any) => {
    const row = displayedData[index];

    if (row.isGroupHeader) {
      return <TableGroupRow key={key} style={style} text="" />;
    }

    return (
      <BuySellTableRow
        order={row}
        $rowIndex={index}
        onClick={() => handleTransactionTableRow(row)}
        $isLast={index === displayedData.length - 1}
      />
    );
  };

  return (
    <Flex width="full" height="inherit">
      <TableStructure width="full" height="fit-content" my={0}>
        <TableSearchFilter
          placeholder={strings.search}
          value={searchTerm}
          onChange={setSearchTerm}
          handleDownloadCSV={handleDownloadCSV}
          downloadCSVTooltip={langStrings.tooltips.downloadCsv}
        />
        {displayedData.length > 0 ? (
          <>
            <BuySellTableHeader
              provider={strings.header.provider}
              assetTo={strings.header.assetTo}
              received={strings.header.received}
              sent={strings.header.sent}
              onSort={onSort}
              selected={sortedBy}
              $ascending={isAscending}
            />
            <Virtualize.AutoSizer>
              {({ width }: any) => (
                <Virtualize.List
                  ref={listRef}
                  height={windowHeight - topbarHeight - 173 - 57}
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
            text={strings.noSearchResult.text}
            subText={strings.noSearchResult.subText}
            searchText={searchTerm}
          />
        )}
      </TableStructure>
    </Flex>
  );
};
