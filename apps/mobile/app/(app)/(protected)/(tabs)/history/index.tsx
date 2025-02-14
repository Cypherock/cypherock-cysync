import {
  Container,
  Flex,
  HistoryTableAmountCell,
  HistoryTableTimeCell,
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
import { useAppSelector } from '@/store';
import { selectLanguage } from '@/store/lang';
import { router } from 'expo-router';
import React from 'react';
import { TransactionRowData, useTransactions } from '@/hooks/useTransactions';
import { useHistoryContext } from '@/contexts/useHistoryContext';

export default function History() {
  const { strings } = useAppSelector(selectLanguage);
  const { isAscending, onSort, displayedData, sortedBy } = useTransactions();
  const { setSelectedTransaction } = useHistoryContext();

  if (displayedData?.length === 0) {
    return (
      <NoDataScreen
        title={strings.portfolio.noAccount.title}
        description={strings.portfolio.noAccount.subTitle}
        onAction={() => router.push('/scan')}
        actionText={strings.buttons.scanQrCode}
      />
    );
  }

  return (
    <ScreenContainer>
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
      </Flex>
      <Table>
        <TableHeader>
          {[
            strings.history.history.table.time,
            strings.history.history.table.amount,
          ].map(v => (
            <TableHeaderData
              key={v}
              data={v}
              ascending={sortedBy === v && isAscending}
              onPress={() => onSort(v.toLocaleLowerCase())}
            />
          ))}
        </TableHeader>
        <TableBody
          type="section"
          data={displayedData}
          renderItem={({
            item,
            index,
          }: {
            item: TransactionRowData;
            index: number;
          }) => (
            <TableRowData
              index={index}
              onPress={() => {
                setSelectedTransaction(item);
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
          )}
          renderSectionHeader={({ section: { title } }) => (
            <Container
              style={{ backgroundColor: colors.black, paddingVertical: 10 }}
            >
              <Typography type="para" color="primary">
                {title}
              </Typography>
            </Container>
          )}
          seperator={() => (
            <Seperator style={{ backgroundColor: colors.black }} />
          )}
        />
      </Table>
    </ScreenContainer>
  );
}
