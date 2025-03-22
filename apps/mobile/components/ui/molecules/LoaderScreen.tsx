import { View, Text } from 'react-native';
import React from 'react';
import LottieView from 'lottie-react-native';
import { Container, ScreenContainer, Typography } from '../atoms';

interface ILoaderProps {
  title?: string;
  loaderSize?: number;
}

export const LoaderScreen = ({ title, loaderSize = 200 }: ILoaderProps) => {
  return (
    <ScreenContainer>
      <Container
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          paddingHorizontal: 16,
          paddingVertical: 12,
        }}
      >
        <LottieView
          autoPlay
          loop
          source={require('@/assets/lottie/loader.json')}
          style={{ width: loaderSize, height: loaderSize }}
        />
        {title && (
          <Typography type="para" color="primary">
            {title}
          </Typography>
        )}
      </Container>
    </ScreenContainer>
  );
};
