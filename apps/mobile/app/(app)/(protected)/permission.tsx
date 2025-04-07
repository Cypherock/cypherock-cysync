import React from 'react';
import { Card, OnboardingItem, ScreenContainer } from '@/components/ui';
import { Images } from '@/constants';
import { Image } from 'expo-image';
import { useCameraPermissions } from 'expo-camera';
import { useAppSelector } from '@/store';
import { selectLanguage } from '@/store/lang';
import { Redirect, router } from 'expo-router';
import { Alert } from 'react-native';
import { openSettings } from 'expo-linking';

export default function Permission() {
  const { strings } = useAppSelector(selectLanguage);
  const [permission, requestPermission] = useCameraPermissions();

  function handleRequestPermission() {
    if (!permission) return;

    if (permission.canAskAgain) {
      requestPermission();
    } else {
      Alert.alert(
        strings.onboarding.permission.alert.title,
        strings.onboarding.permission.alert.description,
        [
          {
            text: strings.buttons.openSettings,
            onPress: () => {
              openSettings();
              router.replace('/portfolio');
            },
          },
          {
            text: strings.buttons.cancel,
            style: 'cancel',
          },
        ],
        {
          cancelable: true,
        },
      );
    }
  }

  if (permission?.granted) {
    return <Redirect href={'/scan'} />;
  }

  return (
    <ScreenContainer>
      <OnboardingItem
        id={1}
        imageNode={
          <Card style={{ width: 64, height: 64, justifyContent: 'center' }}>
            <Image
              source={Images.onboarding.camera}
              style={{ width: 46, height: 36 }}
            />
          </Card>
        }
        title={strings.onboarding.permission.title}
        subtitle={strings.onboarding.permission.description}
        actions={{
          primary: {
            title: strings.buttons.continue,
            onPress: handleRequestPermission,
          },
        }}
      />
    </ScreenContainer>
  );
}
