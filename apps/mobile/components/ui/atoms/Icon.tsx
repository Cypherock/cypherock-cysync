import React from 'react';
import { Image } from 'expo-image';
import { Pressable, PressableProps, StyleSheet } from 'react-native';

type IconType = 'default' | 'small' | 'big';
type IconState = 'default' | 'active' | 'disabled';

export interface IconProps extends PressableProps {
  size?: IconType;
  state?: IconState;
  source: Partial<Record<IconState, any>>;
}

export function Icon({
  size = 'default',
  state = 'default',
  ...props
}: IconProps) {
  return (
    <Pressable style={{ padding: 8 }} {...props}>
      {state === 'active' && (
        <Image source={props.source.active} style={styles[size]} />
      )}
      {state === 'default' && (
        <Image source={props.source.default} style={styles[size]} />
      )}
      {state === 'disabled' && (
        <Image source={props.source.disabled} style={styles[size]} />
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  default: {
    width: 16,
    height: 16,
  },
  small: {
    width: 12,
    height: 12,
  },
  big: {
    width: 32,
    height: 32,
  },
});
