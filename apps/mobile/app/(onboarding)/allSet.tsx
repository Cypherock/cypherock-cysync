import { OnboardingItem, ScreenContainer } from '@/components/ui';
import { useAppSelector } from '@/store';
import { selectLanguage } from '@/store/lang';
import { Images } from '@/constants/images';
import { router } from 'expo-router';
import { Image } from 'expo-image';

export default function AllSet() {
  const { strings } = useAppSelector(selectLanguage);

  return (
    <ScreenContainer>
      <OnboardingItem
        id={6}
        imageNode={
          <Image
            source={Images.onboarding.screen5}
            style={{ width: 326, height: 344 }}
            contentFit="contain"
          />
        }
        title={strings.onboarding.allSet.title}
        titleType="h2"
        subtitle={strings.onboarding.allSet.subtitle}
        actions={{
          primary: {
            title: strings.buttons.continue,
            onPress: () => router.push('/(onboarding)/PasswordPage'),
          },
        }}
      />
    </ScreenContainer>
  );
}
