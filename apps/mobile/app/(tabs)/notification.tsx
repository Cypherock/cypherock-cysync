import React, { useState } from 'react';
import {
  Card,
  NotificationItem,
  ScreenContainer,
  Typography,
} from '@/components/ui';
import { SectionList } from 'react-native';
import NoDataScreen from '@/components/ui/molecules/NoDataScreen';

export default function Notification() {
  const [notification] = useState();
  return (
    <ScreenContainer>
      {notification ? (
        <NoDataScreen title="No notifications yet!" />
      ) : (
        <SectionList
          style={{
            flex: 1,
            width: '100%',
            paddingHorizontal: 16,
            paddingVertical: 16,
          }}
          sections={notification}
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
      )}
    </ScreenContainer>
  );
}
