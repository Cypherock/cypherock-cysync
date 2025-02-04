import React, { useEffect } from 'react';
import { Image } from 'expo-image';
import { Images } from '@/constants';
import { OnboardingItem, ScreenContainer } from '@/components/ui';
import { router } from 'expo-router';
import { useAppSelector } from '@/store';
import { selectLanguage } from '@/store/lang';

export default function Info() {
  const { strings } = useAppSelector(selectLanguage);
  return (
    <ScreenContainer>
      <OnboardingItem
        id={1}
        imageNode={
          <Image
            source={Images.onboarding.screen4_2}
            style={{ width: 154.29, height: 120 }}
          />
        }
        title={strings.onboarding.info.title}
        subtitle={strings.onboarding.info.description}
        actions={{
          primary: {
            title: strings.buttons.ok,
            onPress: () => router.replace('/receive/wallet'),
          },
        }}
      />
    </ScreenContainer>
  );
}