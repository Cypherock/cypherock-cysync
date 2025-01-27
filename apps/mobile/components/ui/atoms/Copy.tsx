import Ionicons from '@expo/vector-icons/Ionicons';
import { colors } from '../themes/color.styled';
import { FC } from 'react';
import { IconProps } from '@expo/vector-icons/build/createIconSet';

export const Copy: FC<Omit<IconProps<'IonIcons'>, 'name'>> = props => (
  <Ionicons
    {...props}
    name="copy-outline"
    size={props.size ?? 16}
    color={colors.text.accent}
  />
);
