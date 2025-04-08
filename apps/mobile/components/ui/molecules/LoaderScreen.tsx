import { View, Text } from 'react-native';
import React from 'react';
import LottieView from 'lottie-react-native';
import { Container, ScreenContainer, Typography } from '../atoms';

interface ILoaderProps {
  title?: string;
  loaderSize?: number;
  progress?: number;
  showProgress?: boolean;
}

export const LoaderScreen = ({
  title,
  loaderSize = 200,
  progress = 0,
  showProgress = false,
}: ILoaderProps) => {
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
        <Container
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            maxWidth: loaderSize,
            maxHeight: loaderSize,
          }}
        >
          <LottieView
            autoPlay
            loop
            source={require('@/assets/lottie/loader.json')}
            style={{ width: loaderSize, height: loaderSize }}
          />
          {showProgress && (
            <View style={{ position: 'absolute' }}>
              <Typography type="h3" textAlign="center">
                {`${Math.round(progress)}%`}
              </Typography>
            </View>
          )}
        </Container>
        {title && (
          <Typography type="para" color="primary">
            {title}
          </Typography>
        )}
      </Container>
    </ScreenContainer>
  );
};
