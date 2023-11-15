import {
  AccountTableHeader,
  TableStructure,
  AccountTableRow,
  TableSearch,
  AccountTableHeaderName,
  NoSearchResult,
  NotFound,
} from '@cypherock/cysync-ui';
import React, { useEffect, useRef } from 'react';
import * as Virtualize from 'react-virtualized/dist/umd/react-virtualized';

import { useStateWithRef, useWindowSize } from '~/hooks';
import { selectLanguage, useAppSelector } from '~/store';

import { AccountRowData } from '../hooks';

export interface AccountTableProps {
  accountRows: AccountRowData[];
  onClick: (id: string) => void;
  onTokenClick: (id: string) => void;
  onStatusClick: (row: AccountRowData) => void;
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  onSort: (column: AccountTableHeaderName) => void;
  isAscending: boolean;
  sortedBy: AccountTableHeaderName;
  topbarHeight: number;
}

const ROW_HEIGHT = 85;
const TOKEN_BTN_HEIGHT = 45;
const TOKEN_ROW_HEIGHT = 63;

export const AccountTable: React.FC<AccountTableProps> = ({
  accountRows,
  onClick,
  onTokenClick,
  onStatusClick,
  searchTerm,
  setSearchTerm,
  onSort,
  isAscending,
  sortedBy,
  topbarHeight,
}) => {
  const lang = useAppSelector(selectLanguage);
  const listRef = useRef<any>(null);
  const { windowHeight } = useWindowSize();
  const [showTokensMap, setShowTokensMap, showTokensMapRef] = useStateWithRef<
    Record<string, boolean | undefined>
  >({});

  useEffect(() => {
    if (listRef.current?.recomputeRowHeights) {
      listRef.current.recomputeRowHeights();
    }
  }, [accountRows, showTokensMap]);

  const onShowTokensClick = (row: AccountRowData) => {
    setShowTokensMap({
      ...showTokensMapRef.current,
      [row.id]: !showTokensMapRef.current[row.id],
    });
  };

  const rowRenderer = ({ key, index, style }: any) => {
    const row = accountRows[index];

    return (
      <AccountTableRow
        style={style}
        key={key}
        id={row.id}
        leftImage={row.leftImage}
        text={row.text}
        subText={row.subText}
        tag={row.tag}
        statusImage={row.statusImage}
        amount={row.displayAmount}
        amountTooltip={row.amountTooltip}
        value={row.displayValue}
        tokens={row.tokens?.map(t => ({
          ...t,
          amount: t.displayAmount,
          value: t.displayValue,
        }))}
        $isLast={index === accountRows.length - 1}
        $rowIndex={index}
        $hide={lang.strings.wallet.buttons.hide}
        $show={lang.strings.wallet.buttons.show}
        onClick={() => onClick(row.id)}
        onStatusClick={() => onStatusClick(row)}
        onTokenClick={onTokenClick}
        onShowTokensClick={() => onShowTokensClick(row)}
        showTokens={showTokensMapRef.current[row.id] ?? false}
      />
    );
  };

  const getRowHeight = ({ index }: { index: number }) => {
    const row = accountRows[index];

    let height = ROW_HEIGHT;

    if (row.tokens && row.tokens.length > 0) {
      height += TOKEN_BTN_HEIGHT;

      if (showTokensMapRef.current[row.id]) {
        height += Math.min(215, row.tokens.length * TOKEN_ROW_HEIGHT);
      }
    }

    return height;
  };

  return (
    <TableStructure mt={0}>
      <TableSearch
        placeholder={lang.strings.wallet.search.placeholder}
        heading={lang.strings.wallet.tableTitle}
        value={searchTerm}
        onChange={setSearchTerm}
      />
      {accountRows.length > 0 ? (
        <>
          <AccountTableHeader
            account={lang.strings.wallet.tableHeader.account}
            syncStatus={lang.strings.wallet.tableHeader.syncStatus}
            balance={lang.strings.wallet.tableHeader.balance}
            value={lang.strings.wallet.tableHeader.value}
            $ascending={isAscending}
            selected={sortedBy}
            onSort={onSort}
          />
          <Virtualize.AutoSizer>
            {({ width }: any) => (
              <Virtualize.List
                ref={listRef}
                height={windowHeight - topbarHeight - 221 - 20}
                width={width}
                rowCount={accountRows.length}
                rowHeight={getRowHeight}
                rowRenderer={rowRenderer}
              />
            )}
          </Virtualize.AutoSizer>
        </>
      ) : (
        <NoSearchResult
          image={<NotFound />}
          text={lang.strings.wallet.search.text}
          subText={lang.strings.wallet.search.subText}
          searchText={searchTerm}
        />
      )}
    </TableStructure>
  );
};
