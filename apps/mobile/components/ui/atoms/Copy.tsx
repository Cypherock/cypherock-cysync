import Ionicons from '@expo/vector-icons/Ionicons';
import { colors } from '../themes/color.styled';
import { FC } from 'react';
import { IconProps } from '@expo/vector-icons/build/createIconSet';
import { Pressable, View } from 'react-native';

export const Copy: FC<
  Omit<IconProps<'IonIcons'>, 'name'> & { onPress: () => void; copied: boolean }
> = ({ onPress, copied, ...props }) => (
  <Pressable onPress={onPress}>
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 2 }}>
      <Ionicons
        {...props}
        name={copied ? 'checkmark-sharp' : 'copy-outline'}
        size={props.size ?? 16}
        color={copied ? colors.success : colors.text.accent}
      />
    </View>
  </Pressable>
);
