import React, { ReactNode, useEffect, useState } from 'react';
import { View } from 'react-native';
import { Header as StyledHeader, SyncIcon, useTheme } from '../ui';
import { router } from 'expo-router';
import { Icon } from '@/components/ui';
import { Images } from '@/constants';
import {
  selectAccountSync,
  selectNotifications,
  useAppSelector,
} from '@/store';
import { QRIcon } from '../ui/icons/qr-icon';

interface HeaderProps {
  title: string;
  leftIcon?: ReactNode;
  showBack?: boolean;
  onBackPress: () => void;
  showDiscard?: boolean;
  onDiscard: () => void;
}

export function Header({
  title,
  leftIcon = undefined,
  showBack = true,
  onBackPress,
  showDiscard = false,
  onDiscard = () => (router.canDismiss() ? router.dismiss() : router.back()),
}: HeaderProps) {
  const theme = useTheme();
  const { unreadTransactions } = useAppSelector(selectNotifications);
  const { syncState } = useAppSelector(selectAccountSync);
  const [showNotification, setShowNotification] = useState('default');

  useEffect(() => {
    setShowNotification(unreadTransactions > 0 ? 'active' : 'default');
  }, [unreadTransactions]);

  return (
    <StyledHeader
      title={title}
      leftIcon={leftIcon}
      showBack={showBack}
      onBackPress={onBackPress}
      rightIcons={
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
          <SyncIcon
            fill={
              syncState === 'synced' || syncState === 'syncing'
                ? theme.palette.success
                : theme.palette.error
            }
            onPress={() => router.dismissTo('/loading')}
          />
          <Icon
            source={{
              active: Images.icon.notification_default,
              default: Images.icon.notification_plain_default,
            }}
            key={showNotification}
            state={showNotification}
            onPress={() => router.push('/notification')}
          />
          <QRIcon onPress={() => router.push('/scan')} style={{ padding: 8 }} />
        </View>
      }
      showDiscard={showDiscard}
      onDiscard={onDiscard}
    />
  );
}
