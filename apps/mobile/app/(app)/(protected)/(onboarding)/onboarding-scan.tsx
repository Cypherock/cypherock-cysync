import { Image } from 'expo-image';
import { router } from 'expo-router';
import { OnboardingItem, ScreenContainer } from '@/components/ui';
import { Images } from '@/constants/images';
import { useAppSelector } from '@/store';
import { selectLanguage } from '@/store/lang';

export default function ScanQRScreen() {
  const { strings } = useAppSelector(selectLanguage);

  return (
    <ScreenContainer>
      <OnboardingItem
        id={1}
        imageNode={
          <Image
            source={Images.onboarding.screen4_1}
            style={{ width: 120, height: 120 }}
          />
        }
        title={strings.onboarding.scan.title}
        titleType="h2"
        subtitles={[
          strings.onboarding.scan.description[0],
          strings.onboarding.scan.description[1],
        ]}
        actions={{
          primary: {
            title: strings.buttons.scanQrCode,
            onPress: () => router.dismissTo('/scan'),
          },
          secondary: {
            title: strings.buttons.buyCypherockX1,
            onPress: () =>
              router.navigate(
                'https://www.cypherock.com/product/cypherock-x1/',
              ),
          },
        }}
      />
    </ScreenContainer>
  );
}
