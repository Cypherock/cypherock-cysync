import { View, Text } from 'react-native';
import React from 'react';
import LottieView from 'lottie-react-native';
import { Container, ScreenContainer, Typography } from '../atoms';

interface ILoaderProps {
  title?: string;
}

export const LoaderScreen = ({ title }: ILoaderProps) => {
  return (
    <ScreenContainer>
      <Container
        style={{
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <LottieView
          autoPlay
          loop
          source={require('@/assets/lottie/loader.json')}
          style={{ width: 200, height: 200 }}
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
