import {
  OnboardingItem,
  ScreenContainer,
  IOnboardingItem,
} from '@/components/ui';
import { Images, Links } from '@/constants';
import { useAppSelector } from '@/store';
import { selectLanguage } from '@/store/lang';
import { router } from 'expo-router';

export default function Sync() {
  const { strings } = useAppSelector(selectLanguage);

  const item: IOnboardingItem = {
    id: 6,
    image: Images.onboarding.screen4_2,
    title: strings.onboarding.scan.title,
    titleType: 'h2',
    subtitles: [
      strings.onboarding.scan.description[0],
      strings.onboarding.scan.description[1],
    ],
    actions: {
      primary: {
        title: strings.buttons.scanQrCode,
        onPress: () => router.dismissTo('/onboarding-scan'),
      },
      secondary: {
        title: strings.buttons.buyCypherockX1,
        onPress: () => router.navigate(Links.product.cypherockX1),
      },
    },
  };

  return (
    <ScreenContainer>
      <OnboardingItem {...item} />
    </ScreenContainer>
  );
}
