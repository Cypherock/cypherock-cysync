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
import { useAppSelector } from '@/store';
import { selectLanguage } from '@/store/lang';
import { router } from 'expo-router';
import { useState } from 'react';

export default function History() {
  const { strings } = useAppSelector(selectLanguage);
  const [history] = useState();

  if (!history) {
    return (
      <NoDataScreen
        title={strings.portfolio.noAccount.title}
        description={strings.portfolio.noAccount.subTitle}
        action={() => router.push('/scan')}
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
            item: NotificationProps;
            index: number;
          }) => (
            <TableRowData
              index={index}
              onPress={() =>
                router.push(
                  '/(tabs)/history/details/1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
                )
              }
            >
              <HistoryTableTimeCell
                transactionType={item.type}
                transactionStatus={item.status}
                transactionTime={new Date(item.time).toLocaleTimeString(
                  'en-US',
                  {
                    hour: '2-digit',
                    minute: '2-digit',
                  },
                )}
              />
              <HistoryTableAmountCell
                icon={item.icon}
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
    </ScreenContainer>
  );
}
