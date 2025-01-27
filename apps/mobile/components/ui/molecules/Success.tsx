import { View } from 'react-native';
import React, { useEffect } from 'react';
import { Button, Container, ScreenContainer, Typography } from '../atoms';
import Ionicons from '@expo/vector-icons/Ionicons';
import { colors } from '../themes/color.styled';
import { router } from 'expo-router';

interface SuccessScreenProps {
  title: string;
  subTitle?: string;
  actionText?: string;
  onAction?: () => void;
  redirectRoute?: string;
}

export function Success({
  title,
  subTitle,
  actionText,
  onAction,
  redirectRoute,
}: SuccessScreenProps) {
  useEffect(() => {
    if (redirectRoute) {
      const timer = setTimeout(() => {
        router.replace(redirectRoute);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [redirectRoute]);

  return (
    <ScreenContainer>
      <Container
        style={{
          gap: 16,
          justifyContent: 'center',
          alignItems: 'center',
          paddingVertical: 12,
          paddingHorizontal: 16,
        }}
      >
        <Ionicons
          name="checkmark-circle"
          size={64}
          color={colors.text.success}
        />
        <View style={{ gap: 4 }}>
          <Typography type="h3">{title}</Typography>
          {subTitle && (
            <Typography type="body" color="secondary" style={{ flexShrink: 0 }}>
              {subTitle}
            </Typography>
          )}
        </View>
      </Container>
      {actionText && onAction && (
        <View style={{ width: '100%', justifyContent: 'flex-end' }}>
          <Button
            title={actionText}
            style={{ marginHorizontal: 16, marginVertical: 12 }}
            onPress={onAction}
          />
        </View>
      )}
    </ScreenContainer>
  );
}
