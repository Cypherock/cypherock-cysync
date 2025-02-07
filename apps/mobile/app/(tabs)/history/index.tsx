import {
  Container,
  Flex,
  HistoryTableAmountCell,
  HistoryTableTimeCell,
  NotificationProps,
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
import { getDB } from '@/utils';
import { useAppSelector } from '@/store';
import { selectLanguage } from '@/store/lang';
import { ITransaction, TransactionType } from '@cypherock/db-interfaces';
import { router } from 'expo-router';
import { useState, useEffect } from 'react';
import { CoinIcon } from '@/components/core';

type IHistory = Array<{
  title: string;
  data: ITransaction[];
}>;

export default function History() {
  const { strings } = useAppSelector(selectLanguage);
  const [history, setHistory] = useState<IHistory>([]);

  async function getHistory() {
    const db = getDB();
    try {
      const history = await db.transaction.getAll();

      const categorizedHistory: IHistory = history.reduce(
        (acc, transaction) => {
          const date = new Date(transaction.timestamp).toLocaleDateString(
            'en-US',
            {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            },
          );
          const existingCategory = acc.find(
            category => category.title === date,
          );
          if (existingCategory) {
            existingCategory.data.push(transaction);
          } else {
            acc.push({ title: date, data: [transaction] });
          }
          return acc;
        },
        [] as IHistory,
      );
      setHistory(categorizedHistory);
    } catch (error) {
      console.log('Cant fetch history', error);
    }
  }

  useEffect(() => {
    getHistory();
  }, []);

  if (history?.length === 0) {
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
      {history.length > 0 && (
        <Table>
          <TableHeader>
            {[
              strings.history.history.table.time,
              strings.history.history.table.amount,
            ].map(v => (
              <TableHeaderData
                key={v}
                data={v}
                ascending={false}
                onClick={() => console.log('Header Pressed')}
              />
            ))}
          </TableHeader>
          <TableBody
            type="section"
            data={history}
            renderItem={({
              item,
              index,
            }: {
              item: ITransaction;
              index: number;
            }) => (
              <TableRowData
                index={index}
                onPress={() =>
                  router.push(`/(tabs)/history/details/${item.__id}`)
                }
              >
                <HistoryTableTimeCell
                  transactionType={item.type}
                  transactionStatus={item.status}
                  transactionTime={new Date(item.timestamp).toLocaleTimeString(
                    'en-US',
                    {
                      hour: '2-digit',
                      minute: '2-digit',
                    },
                  )}
                />
                <HistoryTableAmountCell
                  icon={<CoinIcon parentAssetId={item.parentAssetId} />}
                  cryptoAmount={item.amount}
                  fiatAmount={item.status}
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
      )}
    </ScreenContainer>
  );
}
