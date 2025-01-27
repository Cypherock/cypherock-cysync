import React from 'react';
import {
  Card,
  NotificationItem,
  NotificationProps,
  ScreenContainer,
  Typography,
} from '@/components/ui';
import { SectionList } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

interface INotifications {
  title: string;
  data: NotificationProps[];
}

const dummyNotifications: INotifications[] = [
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

export default function Notification() {
  return (
    <ScreenContainer>
      <SectionList
        style={{
          flex: 1,
          width: '100%',
          paddingHorizontal: 16,
          paddingVertical: 16,
        }}
        sections={dummyNotifications}
        renderItem={({ item }) => (
          <NotificationItem
            {...item}
            time={new Date(item.time).toLocaleTimeString()}
          />
        )}
        renderSectionHeader={({ section: { title } }) => (
          <Card style={{ marginTop: 16, paddingVertical: 4 }}>
            <Typography type="para">{title}</Typography>
          </Card>
        )}
      />
    </ScreenContainer>
  );
}
