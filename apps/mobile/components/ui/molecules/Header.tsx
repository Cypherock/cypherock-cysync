import { View, StyleSheet } from 'react-native';
import React from 'react';
import { HeaderContainer, Typography } from '../atoms';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AntDesign from '@expo/vector-icons/AntDesign';
import styled from 'styled-components/native';
import { colors } from '../themes/color.styled';
import Feather from '@expo/vector-icons/Feather';

interface HeaderProps {
  title: string;
  showBack?: boolean;
  rightIcons?: JSX.Element;
  leftIcon?: JSX.Element;
  onBackPress: () => void;
  showDiscard?: boolean;
  onDiscard?: () => void;
}

const IconContainer = styled(View)`
  display: flex;
  width: 20px;
  height: 20px;
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
          onPress={onBackPress}
          color={'white'}
        />
      )}
      {leftIcon && <IconContainer>{leftIcon}</IconContainer>}
      <Typography type="h1" style={styles.title}>
        {title}
      </Typography>
      {!showDiscard && rightIcons}
      {showDiscard && (
        <Feather
          name="x"
          size={14}
          color={colors.text.secondary}
          onPress={onDiscard}
        />
      )}
    </HeaderContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#1C1815',
    paddingHorizontal: 16,
    paddingBottom: 16,
    alignItems: 'baseline',
    gap: 16,
  },
  title: {
    textAlign: 'left',
    fontWeight: 600,
    textTransform: 'capitalize',
    fontSize: 20,
    flex: 1,
  },
  rightIcons: {
    gap: 24,
    flexDirection: 'row',
    alignItems: 'center',
  },
});
