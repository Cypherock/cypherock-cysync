import { View, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import React from 'react';

interface PagerDotsProps {
  index: number;
  length: number;
}

interface AnimatedDotProps {
  activeIndex: number;
  index: number;
}

function AnimatedDot({ activeIndex, index }: AnimatedDotProps) {
  const animatedStyle = useAnimatedStyle(() => {
    const isActive = index === activeIndex;
    return {
      width: withTiming(isActive ? 24 : 5, {
        duration: 100,
        easing: Easing.ease,
      }),
      backgroundColor: withTiming(isActive ? 'white' : '#8B8682', {
        duration: 200,
      }),
    };
  });
  return <Animated.View key={index} style={[styles.dot, animatedStyle]} />;
}

export function PagerDots({ index, length }: PagerDotsProps) {
  return (
    <View style={styles.container}>
      {new Array(length).fill(0).map((_, i) => (
        <AnimatedDot key={i} index={i} activeIndex={index} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 4,
    marginTop: 5,
  },
  dot: {
    width: 5,
    height: 5,
    backgroundColor: '#8B8682',
    borderRadius: 3,
  },
});
