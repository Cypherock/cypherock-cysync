import React from 'react';
import { Header as StyledHeader } from '../ui';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { router } from 'expo-router';
import { colors } from '../ui/themes/color.styled';

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
  return (
    <StyledHeader
      title={title}
      leftIcon={leftIcon}
      showBack={showBack}
      onBackPress={onBackPress}
      rightIcons={
        <>
          <MaterialCommunityIcons
            name={'bell-badge-outline'}
            size={24}
            color={colors.text.secondary}
            onPress={() => router.push('/notification')}
          />
          <MaterialCommunityIcons
            name="qrcode"
            size={18}
            color={'#8B8682'}
            onPress={() => router.push('/scan')}
          />
        </>
      }
      showDiscard={showDiscard}
      onDiscard={() => router.back()}
    />
  );
}
