import React from 'react';
import Feather from '@expo/vector-icons/Feather';
import { ScreenContainer, OnboardingItem } from '../ui';
import { theme } from '../ui/themes/theme.styled';
import { reloadAppAsync } from 'expo';

export function ErrorScreen({ message }: { message?: string }) {
  const retry = () => {
    reloadAppAsync();
  };

  return (
    <ScreenContainer>
      <OnboardingItem
        id={1}
        imageNode={
          <Feather
            name="alert-circle"
            size={100}
            color={theme.palette.warning}
          />
        }
        title={message ?? 'Oops, something went wrong!'}
        titleType="h2"
        subtitle={
          'We ran into an issue. Please try again, and if the problem continues, feel free to reach out to our support team.'
        }
        actions={{
          primary: {
            title: 'Try Again',
            onPress: retry,
          },
        }}
      />
    </ScreenContainer>
  );
}
