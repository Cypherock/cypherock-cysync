import { Image } from 'expo-image';
import styled from 'styled-components/native';
import { colors } from '../themes/color.styled';
import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { PressableProps } from 'react-native';

interface BannerProps extends PressableProps {
  img: any;
  title: string;
  subtitle: string;
  onPress: () => void;
}

const BannerContainer = styled.Pressable`
  padding-right: 10px;
  flex-direction: row;
  align-items: center;
  border-radius: 8px;
  overflow: hidden;

  background: ${({ theme }) => theme.palette.background.banner};
`;

const BannerTextContainer = styled.View`
  padding-left: 10px;
  padding-vertical: 6px;
  flex: 1;
`;

const BannerTitle = styled.Text`
  font-size: ${({ theme }) => theme.typography.fontSize.sm}px;
  color: ${({ theme }) => theme.palette.accent};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
`;

const BannerSubtitle = styled.Text`
  font-size: ${({ theme }) => theme.typography.fontSize.xs * 0.8}px;
  color: ${({ theme }) => theme.palette.text.primary};
`;

export const Banner = ({
  img,
  title,
  subtitle,
  onPress,
  ...props
}: BannerProps) => {
  return (
    <BannerContainer onPress={onPress} {...props}>
      <Image source={img} style={{ width: 109, height: 38 }} />
      <BannerTextContainer>
        <BannerTitle>{title}</BannerTitle>
        <BannerSubtitle>{subtitle}</BannerSubtitle>
      </BannerTextContainer>
      <FontAwesome
        name="chevron-right"
        size={8}
        color={colors.text.secondary}
      />
    </BannerContainer>
  );
};
