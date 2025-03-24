import React from 'react';
import { Card, OnboardingItem, ScreenContainer } from '@/components/ui';
import { Images } from '@/constants';
import { Image } from 'expo-image';
import { useCameraPermissions } from 'expo-camera';
import { useAppSelector } from '@/store';
import { selectLanguage } from '@/store/lang';
import { Redirect } from 'expo-router';

export default function Permission() {
  const { strings } = useAppSelector(selectLanguage);
  const [permission, requestPermission] = useCameraPermissions();

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
            onPress: requestPermission,
          },
        }}
      />
    </ScreenContainer>
  );
}
