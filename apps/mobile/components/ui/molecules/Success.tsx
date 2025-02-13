import { View, StyleSheet } from 'react-native';
import React, { useEffect } from 'react';
import {
  Button,
  Container,
  ScreenContainer,
  Typography,
} from '@/components/ui/atoms';
import { router } from 'expo-router';
import LottieView from 'lottie-react-native';

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
      }, 5000); // 5 seconds

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
        <LottieView
          source={require('@/assets/lottie/success.json')}
          autoPlay
          loop={false}
          style={styles.lottie}
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

const styles = StyleSheet.create({
  lottie: {
    width: 200,
    height: 200,
  },
});
