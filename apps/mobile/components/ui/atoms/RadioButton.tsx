import React from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { colors } from '../themes/color.styled';
import { Typography } from './Typography';

interface RadioButtonProps {
  selected: boolean;
  onPress: () => void;
  label: string;
}

export const RadioButton: React.FC<RadioButtonProps> = ({
  selected,
  onPress,
  label,
}) => {
  return (
    <Pressable style={styles.container} onPress={onPress}>
      <View
        style={[styles.outerSquare, selected && styles.selectedOuterSquare]}
      >
        {selected && <View style={styles.innerSquare} />}
      </View>
      <Typography type="body" style={styles.label}>
        {label}
      </Typography>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  outerSquare: {
    width: 20,
    height: 20,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: colors.border.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedOuterSquare: {
    borderWidth: 2,
    borderColor: colors.accent,
  },
  innerSquare: {
    width: 14,
    height: 14,
    borderRadius: 3,
    backgroundColor: colors.accent,
  },
  label: {
    color: colors.text.secondary,
  },
});
