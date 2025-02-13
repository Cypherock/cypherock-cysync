import React from 'react';
import { View, StyleSheet } from 'react-native';
import LottieView from 'lottie-react-native';
import { colors } from '@/components/ui/themes/color.styled';

interface LottieSplashProps {
  autoPlay?: boolean;
  loop?: boolean;
  style?: any;
  source: any;
}

export function LottieSplash({
  autoPlay = true,
  loop = true,
  style,
  source,
}: LottieSplashProps) {
  return (
    <View style={styles.container}>
      <LottieView
        autoPlay={autoPlay}
        loop={loop}
        source={source}
        style={[{ width: 200, height: 200 }, style]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
