import {
  Container,
  Flex,
  HistoryTableAmountCell,
  HistoryTableTimeCell,
  Loader,
  LoaderScreen,
  ScreenContainer,
  Seperator,
  Table,
  TableBody,
  TableHeader,
  TableHeaderData,
  TableRowData,
  Typography,
} from '@/components/ui';
import NoDataScreen from '@/components/ui/molecules/NoDataScreen';
import { colors } from '@/components/ui/themes/color.styled';
import { selectNetwork, useAppSelector } from '@/store';
import { selectLanguage } from '@/store/lang';
import { router } from 'expo-router';
import React from 'react';
import {
  TransactionTableHeaderKeys,
  transactionComparatorMap,
  TransactionRowData,
  useTransactions,
} from '@/hooks/useTransactions';
import { useHistoryContext } from '@/contexts/useHistoryContext';

export default function History() {
  const { strings } = useAppSelector(selectLanguage);
  const { isAscending, onSort, displayedData, sortedBy, noData, syncState } =
    useTransactions();
  const { setSelectedTransaction, setFrom } = useHistoryContext();
  const { active } = useAppSelector(selectNetwork);

  if (noData) {
    return (
      <NoDataScreen
        title={strings.portfolio.noAccount.title}
        description={strings.portfolio.noAccount.subTitle}
        onAction={() => router.push('/scan')}
        actionText={strings.buttons.scanQrCode}
      />
    );
  }

  if (displayedData.length === 0 && syncState === 'syncing') {
    return (
      <LoaderScreen loaderSize={80} title={strings.scan.loading.description} />
    );
  }

  return (
    <ScreenContainer>
      {!active && (
        <Typography
          type="h5"
          color="secondary"
          textAlign="center"
          style={{
            paddingHorizontal: 16,
            paddingVertical: 12,
            width: '100%',
          }}
        >
          Internet connection required!
        </Typography>
      )}
      <Flex
        style={{
          backgroundColor: colors.black,
          paddingHorizontal: 16,
          paddingVertical: 12,
          width: '100%',
        }}
      >
        <Typography type="h5" color="secondary" textAlign="left">
          {strings.history.history.title}
        </Typography>
        {syncState === 'syncing' && <Loader />}
      </Flex>
      <Table>
        <TableHeader>
          {(
            Object.keys(
              transactionComparatorMap,
            ) as TransactionTableHeaderKeys[]
          ).map(v => (
            <TableHeaderData
              key={v}
              data={strings.history.history.table[v]}
              ascending={isAscending}
              onPress={() => onSort(v)}
              selected={sortedBy === v}
            />
          ))}
        </TableHeader>
        {displayedData.length === 0 && (
          <Typography
            type="h5"
            color="secondary"
            style={{ paddingVertical: 24 }}
          >
            No Transactions Found!
          </Typography>
        )}
        <TableBody
          data={displayedData}
          renderItem={({
            item,
            index,
          }: {
            item: TransactionRowData;
            index: number;
          }) =>
            item.isGroupHeader ? (
              <Container
                style={{ backgroundColor: colors.black, paddingVertical: 10 }}
              >
                <Typography type="para" color="primary">
                  {item.groupText}
                </Typography>
              </Container>
            ) : (
              <TableRowData
                index={index}
                onPress={() => {
                  setSelectedTransaction(item);
                  setFrom('/history');
                }}
              >
                <HistoryTableTimeCell
                  transactionType={item.type}
                  transactionTypeText={item.typeText}
                  transactionStatus={item.status}
                  transactionTime={item.time}
                />
                <HistoryTableAmountCell
                  icon={<item.assetIcon />}
                  cryptoAmount={item.displayAmount}
                  fiatAmount={item.displayValue}
                />
              </TableRowData>
            )
          }
          separator={() => (
            <Seperator style={{ backgroundColor: colors.black }} />
          )}
        />
      </Table>
    </ScreenContainer>
  );
}
