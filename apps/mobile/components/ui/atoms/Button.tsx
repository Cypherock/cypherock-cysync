import React, { FC } from 'react';
import { TouchableOpacityProps, View } from 'react-native';
import styled, { css } from 'styled-components/native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../themes/color.styled';

type ButtonSize = 'lg' | 'sm';
type ButtonType = 'primary' | 'secondary';
type ButtonVariant = 'default' | 'danger' | 'loading';

export interface ButtonProps extends TouchableOpacityProps {
  title: string;
  type?: ButtonType;
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
}

const buttonSizeMap: Record<ButtonSize, any> = {
  lg: {
    body: css`
      border-radius: 8px;
      padding: 20px 14px;
      gap: 16px;
    `,
    text: css`
      font-size: ${({ theme }) => theme.typography.heading.h4.fontSize}px;
      font-weight: 500;
    `,
  },
  sm: {
    body: css`
      border-radius: 8px;
      padding: 6px 14px;
      gap: 8px;
    `,
    text: css`
      font-size: ${({ theme }) => theme.typography.heading.h5.fontSize}px;
      font-weight: 500;
    `,
  },
};

const ButtonContainer = styled.TouchableOpacity<Omit<ButtonProps, 'title'>>`
  ${({ size }) => size && buttonSizeMap[size].body}
  cursor: pointer;
  display: inline-flex;
  overflow: hidden;
  background: ${({ disabled }) =>
    disabled ? colors.background.disabled : 'transparent'};
`;

function getButtonTextColor(type: ButtonType, disabled?: boolean) {
  if (disabled) return colors.text.disabled;
  else if (type === 'secondary') return colors.gradient.gold[0];
  else return '#000';
}

const ButtonText = styled.Text<{
  size: ButtonSize;
  type: ButtonType;
  disabled?: boolean;
}>`
  ${({ size }) => size && buttonSizeMap[size].text}
  color: ${({ type, disabled }) => getButtonTextColor(type, disabled)};
  text-align: center;
  z-index: 1;
`;

const ButtonGradient: FC<{ type: ButtonType }> = ({ type }) => {
  return (
    <LinearGradient
      colors={colors.gradient.gold}
      start={{ x: 0, y: 1 }}
      end={{ x: 1, y: 1 }}
      locations={[0, 0.37, 1]}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        padding: 2,
      }}
    >
      {type === 'secondary' && (
        <View
          style={{
            backgroundColor: colors.background.primary,
            flex: 1,
            borderRadius: 7,
          }}
        />
      )}
    </LinearGradient>
  );
};

export const Button: FC<ButtonProps> = ({
  onPress,
  title,
  size = 'lg',
  type = 'primary',
  ...props
}) => (
  <ButtonContainer onPress={onPress} size={size} {...props}>
    {!props.disabled && <ButtonGradient type={type} />}
    <ButtonText size={size} type={type} disabled={props.disabled}>
      {title}
    </ButtonText>
  </ButtonContainer>
);
