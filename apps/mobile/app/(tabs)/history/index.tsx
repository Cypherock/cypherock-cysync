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
import { colors } from '@/components/ui/themes/color.styled';
import { useAppSelector } from '@/store';
import { selectLanguage } from '@/store/lang';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { router } from 'expo-router';

interface IHistory {
  title: string;
  data: NotificationProps[];
}

const dummyHistory: IHistory[] = [
  {
    title: 'Monday, February 31, 2024',
    data: [
      {
        type: 'sent',
        status: 'success',
        icon: <MaterialIcons name="check-circle" size={10} color="green" />,
        info: 'Your payment to John was successful and really great that we gave them extra.',
        time: '2024-02-31T10:30:00',
        amount: '$50.00',
      },
      {
        type: 'received',
        status: 'success',
        icon: <MaterialIcons name="check-circle" size={10} color="blue" />,
        info: 'You received a payment from Alice.',
        time: '2024-02-31T09:00:00',
        amount: '$120.00',
      },
    ],
  },
  {
    title: 'Tuesday, March 1, 2024',
    data: [
      {
        type: 'sent',
        status: 'pending',
        icon: <MaterialIcons name="lock-clock" size={10} color="orange" />,
        info: 'Payment to Bob is still processing.',
        time: '2024-03-01T11:15:00',
        amount: '$75.00',
      },
      {
        type: 'received',
        status: 'failed',
        icon: <MaterialIcons name="add-alert" size={10} color="red" />,
        info: 'Payment from Charlie failed.',
        time: '2024-03-01T01:00:00',
        amount: '$200.00',
      },
    ],
  },
  {
    title: 'Wednesday, March 2, 2024',
    data: [
      {
        type: 'sent',
        status: 'failed',
        icon: <MaterialIcons name="add-alert" size={10} color="red" />,
        info: 'Payment to Dave failed.',
        time: '2024-03-02T02:30:00',
        amount: '$90.00',
      },
      {
        type: 'received',
        status: 'pending',
        icon: <MaterialIcons name="lock-clock" size={10} color="orange" />,
        info: 'You are waiting for a payment from Emma.',
        time: '2024-03-02T04:00:00',
        amount: '$45.00',
      },
      {
        type: 'sent',
        status: 'success',
        icon: <MaterialIcons name="check-circle" size={10} color="green" />,
        info: 'Your payment to Frank was successful and really great that we gave them extra.',
        time: '2024-03-02T08:30:00',
        amount: '$30.00',
      },
    ],
  },
  {
    title: 'Thursday, March 3, 2024',
    data: [
      {
        type: 'received',
        status: 'success',
        icon: <MaterialIcons name="check-circle" size={10} color="blue" />,
        info: 'You received a payment from George.',
        time: '2024-03-03T12:00:00',
        amount: '$250.00',
      },
    ],
  },
];

export default function History() {
  const { strings } = useAppSelector(selectLanguage);
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
          data={dummyHistory}
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
