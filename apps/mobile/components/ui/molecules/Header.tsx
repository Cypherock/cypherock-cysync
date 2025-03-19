import React, { ReactNode } from 'react';
import { Typography } from '../atoms';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AntDesign from '@expo/vector-icons/AntDesign';
import styled from 'styled-components/native';
import { colors } from '../themes/color.styled';
import Feather from '@expo/vector-icons/Feather';

interface HeaderProps {
  title: string;
  showBack?: boolean;
  rightIcons?: JSX.Element;
  leftIcon?: ReactNode;
  onBackPress: () => void;
  showDiscard?: boolean;
  onDiscard?: () => void;
}

const HeaderContainer = styled.View`
  flex-direction: row;
  background: ${({ theme }) => theme.palette.background.primary};
  padding-horizontal: 16px;
  padding-vertical: 12px;
  align-items: center;
  gap: 8px;
`;

const IconContainer = styled.View`
  display: flex;
  width: 24px;
  height: 24px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;

  border-radius: 5px;
  background: ${({ theme }) => theme.palette.border.secondary};
`;

export function Header({
  title,
  leftIcon = undefined,
  showBack = false,
  rightIcons = undefined,
  onBackPress,
  showDiscard = undefined,
  onDiscard = undefined,
}: HeaderProps) {
  const insets = useSafeAreaInsets();

  return (
    <HeaderContainer style={{ paddingTop: insets.top }}>
      {showBack && (
        <AntDesign
          name="arrowleft"
          size={18}
          style={{ paddingVertical: 8, paddingHorizontal: 4 }}
          onPress={onBackPress}
          color={'white'}
        />
      )}
      {leftIcon && <IconContainer>{leftIcon}</IconContainer>}
      <Typography
        type="h3"
        textAlign="left"
        style={{ flex: 1, textTransform: 'capitalize' }}
        numberOfLines={1}
      >
        {title}
      </Typography>
      {!showDiscard && rightIcons}
      {showDiscard && (
        <Feather
          name="x"
          size={18}
          style={{ padding: 8 }}
          color={colors.text.primary}
          onPress={onDiscard}
        />
      )}
    </HeaderContainer>
  );
}
