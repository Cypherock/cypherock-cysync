import React from 'react';
import { Pressable, View } from 'react-native';
import { Header as StyledHeader } from '../ui';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { router } from 'expo-router';
import { colors } from '../ui/themes/color.styled';
import { Icon } from '@/components/ui';
import { Images } from '@/constants';

interface HeaderProps {
  title: string;
  leftIcon?: JSX.Element;
  showBack?: boolean;
  onBackPress: () => void;
  showDiscard?: any;
}

export function Header({
  title,
  leftIcon = undefined,
  showBack = true,
  onBackPress,
  showDiscard = false,
}: HeaderProps) {
  let notifications;

  return (
    <StyledHeader
      title={title}
      leftIcon={leftIcon}
      showBack={showBack}
      onBackPress={onBackPress}
      rightIcons={
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
          <Pressable onPress={() => router.push('/notification')}>
            <Icon
              source={{
                default: Images.icon.notification_default,
                disabled: Images.icon.notification_plain_default,
              }}
              size={'default'}
              state={!notifications ? 'disabled' : 'default'}
              onPress={() => router.push('/notification')}
            />
          </Pressable>
          <MaterialCommunityIcons
            name="qrcode"
            onPress={() => router.push('/scan')}
            size={18}
            color={'#8B8682'}
          />
        </View>
      }
      showDiscard={showDiscard}
      onDiscard={() => router.back()}
    />
  );
}
