import {
  Banner,
  Container,
  FilterButton,
  Flex,
  Graph,
  HistoryTableAmountCell,
  HistoryTableTimeCell,
  NotificationProps,
  ScreenContainer,
  SelectFilterSheet,
  Seperator,
  Table,
  TableBody,
  TableHeader,
  TableHeaderData,
  TableRowData,
  Typography,
} from '@/components/ui';
import { colors } from '@/components/ui/themes/color.styled';
import { Images } from '@/constants';
import Entypo from '@expo/vector-icons/Entypo';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { router } from 'expo-router';
import { useCallback, useRef } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const data = [
  { value: 1, label: 'Nov 1' },
  { value: 2, label: 'Nov 5' },
  { value: 9, label: 'Nov 9' },
];

const dummyNotifications = [
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
  {
    type: 'received',
    status: 'success',
    icon: <MaterialIcons name="check-circle" size={10} color="blue" />,
    info: 'You received a payment from George.',
    time: '2024-03-03T12:00:00',
    amount: '$250.00',
  },
];

export default function Accounts() {
  const insets = useSafeAreaInsets();
  const filterRef = useRef<BottomSheetModal | null>(null);

  const handleShowFilter = useCallback(() => {
    filterRef.current?.present();
  }, []);

  const handleHideFilter = useCallback(() => {
    filterRef.current?.close();
  }, []);

  return (
    <ScreenContainer>
      <Banner
        img={Images.other.banner_default}
        onPress={() => console.log('Banner Pressed')}
        title={'Cypherock Cover is here!'}
        subtitle={'Click here to know more'}
      />
      <Container style={{ paddingHorizontal: 12, gap: 24 }}>
        <Flex gap={4}>
          <FilterButton placeholder="All wallets" onPress={handleShowFilter} />
          <FilterButton placeholder="1W" onPress={handleShowFilter} />
        </Flex>
        <Flex justifyContent="space-between">
          <Typography type="h3">$32,584</Typography>
          <Flex gap={8}>
            <Entypo name="triangle-up" size={8} color={colors.success} />
            <Typography type="h5" color={'secondary'}>
              2.3%
            </Typography>
            <Seperator type="v" />
            <Typography type="h5" color={'secondary'}>
              $00.321
            </Typography>
          </Flex>
        </Flex>
        <Graph areaChart data={data} maxValue={30} stepValue={10} />
      </Container>
      <Table style={{ top: -20 }}>
        <TableHeader style={{ backgroundColor: colors.background.input }}>
          {['Time', 'Amount'].map(v => (
            <TableHeaderData
              key={v}
              data={v}
              ascending={false}
              onClick={() => console.log('Header Pressed')}
            />
          ))}
        </TableHeader>
        <TableBody
          type="flat"
          data={dummyNotifications}
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
      <SelectFilterSheet
        ref={filterRef}
        title={'Select Wallet'}
        data={['Cypherock', 'CyA1']}
        onHide={handleHideFilter}
        insets={insets}
      />
    </ScreenContainer>
  );
}
